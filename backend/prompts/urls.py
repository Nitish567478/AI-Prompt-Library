from django.urls import path

from . import views


urlpatterns = [
    path('prompts/', views.prompt_list),
    path('prompts/create/', views.create_prompt),
    path('prompts/<int:id>/', views.prompt_detail),
    path('auth/signup/', views.signup_view),
    path('auth/login/', views.login_view),
    path('auth/logout/', views.logout_view),
    path('auth/me/', views.current_user_view),
]
