from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from apps.students.models import Student
from apps.lessons.models import Lesson
from apps.students.serializers import StudentSerializer
from apps.lessons.serializers import LessonSerializer
from apps.todos.models import Task
from apps.billing.models import Payment

@api_view(['GET'])
def student_list(request):
    """전체 학생 목록 API"""
    students = Student.objects.all().order_by('name')
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def class_list(request):
    """수업 목록 API (날짜 필터링 지원)"""
    target_date = request.query_params.get('date')
    if target_date:
        # 특정 날짜 수업 (캘린더/홈 탭용)
        classes = Lesson.objects.filter(class_date=target_date).order_by('start_time')
    else:
        # 전체 수업 목록
        classes = Lesson.objects.all().order_by('-class_date', 'start_time')
    
    serializer = LessonSerializer(classes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def home_summary(request):
    """홈 상단 요약 지표 API"""
    today = timezone.now().date()

    data = {
        "today_class_count": Lesson.objects.filter(class_date=today).count(),
        "unpaid_count": Payment.objects.filter(status__in=['unpaid', 'pending']).count(),
        "makeup_count": Lesson.objects.filter(status='makeup_scheduled').count(),
        "today_task_count": Task.objects.filter(task_date=today, is_completed=False).count()
    }
    return Response(data)

@api_view(['GET'])
def today_classes(request):
    """오늘 진행 예정인 수업 목록 API"""
    today = timezone.now().date()
    classes = Lesson.objects.filter(class_date=today).order_by('start_time')
    serializer = LessonSerializer(classes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def today_tasks(request):
    """오늘 할 일 목록 API"""
    today = timezone.now().date()
    tasks = Task.objects.filter(task_date=today).order_by('priority')
    
    data = [{
        "id": t.id,
        "title": t.title,
        "is_completed": t.is_completed,
        "priority": t.priority,
        "student_name": t.student.name if t.student else None
    } for t in tasks]
    
    return Response(data)

@api_view(['GET'])
def alerts(request):
    """처리 필요 목록 API (미납 + 보강)"""
    unpaid = Payment.objects.filter(status__in=['unpaid', 'pending'])
    makeups = Lesson.objects.filter(status='makeup_scheduled')
    
    combined = []
    for p in unpaid:
        combined.append({"alert_type": "payment", "student_name": p.student.name, "amount": p.amount, "status": p.status})
    
    for m in makeups:
        combined.append({"alert_type": "makeup", "student_name": m.student.name, "status": m.status, "memo": m.memo})
        
    return Response(combined)