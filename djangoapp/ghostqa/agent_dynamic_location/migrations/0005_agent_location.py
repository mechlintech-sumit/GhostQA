# Generated by Django 5.0.4 on 2024-05-06 19:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("agent_dynamic_location", "0004_alter_job_agent"),
    ]

    operations = [
        migrations.AddField(
            model_name="agent",
            name="location",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="location",
                to="agent_dynamic_location.privatelocation",
            ),
        ),
    ]
