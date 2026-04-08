from django.urls import path
from . import views

urlpatterns = [
    # 프론트엔드가 요구하는 teacher 엔드포인트 매핑
    path('teacher/students/', views.student_list, name='teacher-students'),
    path('teacher/classes/', views.class_list, name='teacher-classes'),
    path('summary/', views.home_summary, name='home-summary'),
]