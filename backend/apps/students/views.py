from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'subject', 'is_active']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
