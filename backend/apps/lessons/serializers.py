from rest_framework import serializers
from .models import Lesson, CancelMakeup

class LessonSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    lesson_date = serializers.CharField(source='class_date', required=False)
    method = serializers.CharField(source='class_mode', required=False)
    prep_done = serializers.BooleanField(source='prep_checked', required=False)
    homework = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'

    def get_homework(self, obj):
        return ''

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # 백엔드 필드명을 프론트 필드명으로 변환
        if 'class_date' in ret:
            ret['lesson_date'] = ret.pop('class_date')
        if 'class_mode' in ret:
            ret['method'] = ret.pop('class_mode')
        if 'prep_checked' in ret:
            ret['prep_done'] = ret.pop('prep_checked')
        return ret

    def to_internal_value(self, data):
        # 프론트 필드명을 백엔드 필드명으로 변환
        if 'lesson_date' in data:
            data['class_date'] = data.pop('lesson_date')
        if 'method' in data:
            data['class_mode'] = data.pop('method')
        if 'prep_done' in data:
            data['prep_checked'] = data.pop('prep_done')
        # homework 필드는 무시 (DB에 없음)
        if 'homework' in data:
            data.pop('homework', None)
        return super().to_internal_value(data)


class CancelMakeupSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = CancelMakeup
        fields = '__all__'