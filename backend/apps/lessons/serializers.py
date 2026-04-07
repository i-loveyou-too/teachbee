from rest_framework import serializers
from .models import Lesson

class LessonSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'