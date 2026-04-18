from django.contrib.auth.models import User
from django.db import models

class Prompt(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prompts', null=True, blank=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField()
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
