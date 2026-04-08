from rest_framework import serializers
from .models import Lesson

class LessonSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.name')

    class Meta:
        model = Lesson
        fields = [
            'id', 'student', 'student_name', 'lesson_date', 'start_time', 
            'end_time', 'subject', 'location', 'method', 'status', 'memo'
        ]