from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'phone', 'default_class_fee', 'is_active']
    list_filter = ['is_active', 'subject']
    search_fields = ['name', 'phone', 'subject']
    ordering = ['name']
