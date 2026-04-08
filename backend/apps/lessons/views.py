from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Lesson, CancelMakeup
from .serializers import LessonSerializer, CancelMakeupSerializer
from apps.students.models import StudentBillingPolicy
from apps.billing.models import PaymentRequest, PaymentRequestClass


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.select_related('student').all()
    serializer_class = LessonSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['class_date', 'student', 'status', 'class_mode']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(class_date=date)
        return qs

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        lesson = self.get_object()
        lesson.status = 'completed'
        lesson.save()
        self._check_and_create_payment_request(lesson)
        serializer = self.get_serializer(lesson)
        return Response({'status': 'completed', 'lesson': serializer.data})

    def _check_and_create_payment_request(self, lesson):
        if not lesson.counts_toward_cycle:
            return
        policy = StudentBillingPolicy.objects.filter(
            student=lesson.student, billing_kind='regular', is_active=True
        ).first()
        if not policy:
            return
        # 미청구 완료 수업 수 카운트
        completed_lessons = Lesson.objects.filter(
            student=lesson.student, status='completed', counts_toward_cycle=True
        ).exclude(
            id__in=PaymentRequestClass.objects.values_list('lesson_id', flat=True)
        ).order_by('class_date')
        if completed_lessons.count() >= policy.cycle_lesson_count:
            lessons_to_bill = list(completed_lessons[:policy.cycle_lesson_count])
            pr = PaymentRequest.objects.create(
                student=lesson.student,
                billing_policy=policy,
                amount=policy.fee_amount,
                lesson_count=len(lessons_to_bill),
                period_start=lessons_to_bill[0].class_date,
                period_end=lessons_to_bill[-1].class_date,
            )
            for l in lessons_to_bill:
                PaymentRequestClass.objects.create(payment_request=pr, lesson=l)


class CancelMakeupViewSet(viewsets.ModelViewSet):
    queryset = CancelMakeup.objects.select_related('student').all()
    serializer_class = CancelMakeupSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'makeup_done']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
