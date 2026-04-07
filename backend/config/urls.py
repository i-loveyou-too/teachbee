from django.contrib import admin
from django.urls import path, include
from apps.common import views as common_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 홈 대시보드 전용 API
    path('api/home/today-classes', common_views.today_classes),
    path('api/home/summary', common_views.home_summary),
    path('api/home/today-tasks', common_views.today_tasks),
    path('api/home/alerts', common_views.alerts),

    path('api/', include('apps.students.urls')),
    path('api/', include('apps.lessons.urls')),
    path('api/', include('apps.billing.urls')),
    path('api/', include('apps.todos.urls')),
]
