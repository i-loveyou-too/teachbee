from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Lesson, CancelMakeup
from .serializers import LessonSerializer, CancelMakeupSerializer


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


class CancelMakeupViewSet(viewsets.ModelViewSet):
    queryset = CancelMakeup.objects.select_related('student').all()
    serializer_class = CancelMakeupSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'makeup_done']
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
