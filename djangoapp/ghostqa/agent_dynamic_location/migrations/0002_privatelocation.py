# Generated by Django 5.0.4 on 2024-05-06 10:45

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("agent_dynamic_location", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PrivateLocation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "ref",
                    models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
                ),
                (
                    "location_name",
                    models.CharField(
                        blank=True, max_length=100, null=True, unique=True
                    ),
                ),
                (
                    "parallel_engine_runs",
                    models.IntegerField(blank=True, default=1, null=True),
                ),
                (
                    "functionality",
                    models.CharField(
                        choices=[("performance", "Performance")],
                        default="performance",
                        max_length=20,
                    ),
                ),
                (
                    "location_type",
                    models.CharField(
                        choices=[("unshared", "Unshared")],
                        default="unshared",
                        max_length=20,
                    ),
                ),
                (
                    "max_threads_per_engine",
                    models.IntegerField(blank=True, default=50, null=True),
                ),
                (
                    "console_xms_mb",
                    models.IntegerField(blank=True, default=1024, null=True),
                ),
                (
                    "console_xmx_mb",
                    models.IntegerField(blank=True, default=4096, null=True),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
