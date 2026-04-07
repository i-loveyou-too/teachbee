from django.contrib import admin
from .models import Lesson, CancelMakeup


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['student', 'class_date', 'start_time', 'subject', 'status', 'prep_checked']
    list_filter = ['status', 'class_mode', 'class_date']
    search_fields = ['student__name', 'subject']
    date_hierarchy = 'class_date'


@admin.register(CancelMakeup)
class CancelMakeupAdmin(admin.ModelAdmin):
    list_display = ['student', 'cancel_date', 'makeup_date', 'makeup_done']
    list_filter = ['makeup_done']
    search_fields = ['student__name']
