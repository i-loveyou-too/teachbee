from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment, PaymentRequest
from .serializers import PaymentSerializer, PaymentRequestSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('student').all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'status', 'due_date']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']


class PaymentRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentRequestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'status']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = PaymentRequest.objects.select_related('student', 'billing_policy').prefetch_related('classes')
        student_id = self.request.query_params.get('student_id')
        status = self.request.query_params.get('status')
        if student_id:
            qs = qs.filter(student_id=student_id)
        if status:
            qs = qs.filter(status=status)
        return qs.order_by('-created_at')
