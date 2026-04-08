from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    text = serializers.CharField(source='title', required=False)
    due_date = serializers.CharField(source='task_date', required=False)
    done = serializers.BooleanField(source='is_completed', required=False)
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

    def to_internal_value(self, data):
        # 프론트 필드명을 백엔드 필드명으로 변환
        if 'text' in data:
            data['title'] = data.pop('text')
        if 'due_date' in data:
            data['task_date'] = data.pop('due_date')
        if 'done' in data:
            data['is_completed'] = data.pop('done')
        # related_student → student 변환
        if 'related_student' in data:
            data['student'] = data.pop('related_student')
        # related_lesson → lesson 변환
        if 'related_lesson' in data:
            data['lesson'] = data.pop('related_lesson')
        return super().to_internal_value(data)