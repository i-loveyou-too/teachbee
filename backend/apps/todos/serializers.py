from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    text = serializers.CharField(source='title', read_only=True)
    due_date = serializers.CharField(source='task_date', read_only=True)
    done = serializers.BooleanField(source='is_completed', read_only=True)
    related_student = serializers.SerializerMethodField()
    related_lesson = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_related_student(self, obj):
        return obj.student.id if obj.student else None

    def get_related_lesson(self, obj):
        return obj.lesson.id if obj.lesson else None

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # 백엔드 필드명을 프론트 필드명으로 변환
        if 'title' in ret:
            ret['text'] = ret.pop('title')
        if 'task_date' in ret:
            ret['due_date'] = ret.pop('task_date')
        if 'is_completed' in ret:
            ret['done'] = ret.pop('is_completed')
        return ret