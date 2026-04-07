from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from apps.lessons.models import Lesson
from apps.todos.models import Task
from apps.billing.models import Payment

@api_view(['GET'])
def today_classes(request):
    """오늘 수업 목록 API"""
    # 쿼리 파라미터로 date가 오면 해당 날짜, 없으면 오늘 날짜 기준
    target_date = request.query_params.get('date', timezone.now().date().isoformat())
    # class_date 필드를 사용하여 필터링 (db_table='classes' 매핑 확인됨)
    classes = Lesson.objects.filter(class_date=target_date).order_by('start_time')
    
    data = [{
        "id": l.id,
        "student_name": l.student.name,
        "class_date": str(l.class_date),
        "start_time": str(l.start_time),
        "end_time": str(l.end_time) if l.end_time else None,
        "subject": l.subject,
        "location": l.location,
        "status": l.status,
    } for l in classes]
    
    return Response(data)

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