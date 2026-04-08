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

    # 프론트엔드 teacher prefix API 대응 (apps.common.views의 목록 함수 연결)
    path('api/teacher/students/', common_views.student_list),
    path('api/teacher/classes/', common_views.class_list),

    path('api/', include('apps.students.urls')),
    path('api/', include('apps.lessons.urls')),
    path('api/', include('apps.billing.urls')),
    path('api/', include('apps.todos.urls')),
]
