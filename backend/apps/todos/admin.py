from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task_date', 'is_completed', 'student']
    list_filter = ['is_completed', 'task_date']
    search_fields = ['title', 'memo']
