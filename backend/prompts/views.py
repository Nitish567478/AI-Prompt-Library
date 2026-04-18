import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Prompt


def serialize_user(user):
    return {
        "id": user.id,
        "username": user.username,
    }


def serialize_prompt(prompt, user):
    is_owner = bool(user.is_authenticated and prompt.owner_id == user.id)

    return {
        "id": prompt.id,
        "title": prompt.title,
        "content": prompt.content,
        "complexity": prompt.complexity,
        "views": prompt.views,
        "created_at": prompt.created_at.strftime("%Y-%m-%d %H:%M"),
        "level": "Easy" if prompt.complexity <= 3 else "Medium" if prompt.complexity <= 7 else "Hard",
        "owner_name": prompt.owner.username if prompt.owner else "Anonymous",
        "is_owner": is_owner,
    }


def prompt_list(request):
    prompts = Prompt.objects.select_related('owner').all().order_by('-created_at')
    data = [serialize_prompt(prompt, request.user) for prompt in prompts]
    return JsonResponse(data, safe=False)


@csrf_exempt
def create_prompt(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)

    data = json.loads(request.body or "{}")

    prompt = Prompt.objects.create(
        owner=request.user,
        title=data.get("title"),
        content=data.get("content"),
        complexity=int(data.get("complexity", 1)),
    )

    return JsonResponse({"id": prompt.id}, status=201)


@csrf_exempt
def prompt_detail(request, id):
    try:
        prompt = Prompt.objects.select_related('owner').get(id=id)

        if request.method == "DELETE":
            if not request.user.is_authenticated:
                return JsonResponse({"error": "Authentication required"}, status=401)

            if prompt.owner_id != request.user.id:
                return JsonResponse({"error": "Only the owner can delete this prompt"}, status=403)

            prompt.delete()
            return JsonResponse({"message": "Prompt deleted successfully"})

        if request.method == "GET":
            prompt.views += 1
            prompt.save(update_fields=["views"])
            return JsonResponse(serialize_prompt(prompt, request.user))

        return JsonResponse({"error": "Invalid method"}, status=405)

    except Prompt.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)


@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    data = json.loads(request.body or "{}")
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if len(username) < 3:
        return JsonResponse({"error": "Username must be at least 3 characters"}, status=400)

    if len(password) < 6:
        return JsonResponse({"error": "Password must be at least 6 characters"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    login(request, user)
    return JsonResponse({"user": serialize_user(user)}, status=201)


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    data = json.loads(request.body or "{}")
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid username or password"}, status=400)

    login(request, user)
    return JsonResponse({"user": serialize_user(user)})


@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    logout(request)
    return JsonResponse({"message": "Logged out successfully"})


def current_user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"user": None})

    return JsonResponse({"user": serialize_user(request.user)})
