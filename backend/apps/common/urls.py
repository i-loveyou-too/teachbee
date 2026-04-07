from django.urls import path
from .views import today_classes, today_tasks, summary, alerts

urlpatterns = [
    path('home/today-classes', today_classes),
    path('home/today-tasks', today_tasks),
    path('home/summary', summary),
    path('home/alerts', alerts),
]
