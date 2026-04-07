from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['task_date', 'is_completed', 'student', 'lesson']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
