from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student, StudentBillingPolicy, StudentRegularSchedule
from .serializers import StudentSerializer, StudentBillingPolicySerializer, StudentRegularScheduleSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'subject', 'is_active']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']


class StudentBillingPolicyViewSet(viewsets.ModelViewSet):
    serializer_class = StudentBillingPolicySerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = StudentBillingPolicy.objects.all()
        student_id = self.request.query_params.get('student_id')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs


class StudentRegularScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = StudentRegularScheduleSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = StudentRegularSchedule.objects.all()
        student_id = self.request.query_params.get('student_id')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs
