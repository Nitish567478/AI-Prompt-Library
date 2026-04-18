from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('prompts', '0002_prompt_created_at_prompt_views'),
    ]

    operations = [
        migrations.AddField(
            model_name='prompt',
            name='owner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='prompts', to=settings.AUTH_USER_MODEL),
        ),
    ]
