from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    class Meta:
        model = Task
        fields = '__all__'