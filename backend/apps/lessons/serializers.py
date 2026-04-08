from rest_framework import serializers
from .models import Lesson, CancelMakeup

class LessonSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    lesson_date = serializers.CharField(source='class_date', required=False)
    method = serializers.CharField(source='class_mode', required=False)
    prep_done = serializers.BooleanField(source='prep_checked', required=False)
    homework = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    regular_day = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    regular_time = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    lesson_method = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    # 상태 매핑
    STATUS_MAPPING_TO_DB = {
        '예정': 'scheduled',
        '완료': 'completed',
        '결석': 'cancelled',
        '보강': 'makeup_scheduled',
    }
    STATUS_MAPPING_TO_FRONT = {v: k for k, v in STATUS_MAPPING_TO_DB.items()}

    class Meta:
        model = Lesson
        fields = [
            'id', 'student', 'student_name', 'class_date', 'lesson_date',
            'start_time', 'end_time', 'subject', 'location', 'class_mode', 'method',
            'status', 'payment_status', 'homework_checked', 'prep_checked', 'prep_done',
            'memo', 'origin_class', 'created_at', 'updated_at', 'homework',
            'regular_day', 'regular_time', 'lesson_method',
            'billing_kind', 'related_class_id', 'makeup_pricing_mode', 'makeup_fee_amount',
            'counts_toward_cycle', 'absence_pricing_mode', 'reschedule_mode',
            'original_class_date', 'change_reason', 'billing_note'
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # 백엔드 필드명을 프론트 필드명으로 변환
        if 'class_date' in ret:
            ret['lesson_date'] = ret.pop('class_date')
        if 'class_mode' in ret:
            ret['method'] = ret.pop('class_mode')
        if 'prep_checked' in ret:
            ret['prep_done'] = ret.pop('prep_checked')
        # 상태값을 영어에서 한글로 변환
        if 'status' in ret:
            ret['status'] = self.STATUS_MAPPING_TO_FRONT.get(ret['status'], ret['status'])
        return ret

    def to_internal_value(self, data):
        # 프론트 필드명을 백엔드 필드명으로 변환
        if 'lesson_date' in data:
            data['class_date'] = data.pop('lesson_date')
        if 'method' in data:
            data['class_mode'] = data.pop('method')
            if 'lesson_method' not in data:
                data['lesson_method'] = data['class_mode']
        if 'prep_done' in data:
            data['prep_checked'] = data.pop('prep_done')
        # 상태값을 한글에서 영어로 변환
        if 'status' in data:
            data['status'] = self.STATUS_MAPPING_TO_DB.get(data['status'], data['status'])
        return super().to_internal_value(data)


class CancelMakeupSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = CancelMakeup
        fields = '__all__'