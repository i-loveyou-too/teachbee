from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('student').all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'status', 'due_date']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
