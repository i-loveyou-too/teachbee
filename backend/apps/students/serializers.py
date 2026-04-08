from rest_framework import serializers
from .models import Student, StudentBillingPolicy, StudentRegularSchedule

class StudentSerializer(serializers.ModelSerializer):
    fee = serializers.IntegerField(source='default_class_fee', required=False)
    payment_status = serializers.SerializerMethodField()
    regular_day = serializers.SerializerMethodField()
    regular_time = serializers.SerializerMethodField()
    lesson_method = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id', 'name', 'phone', 'subject', 'default_location',
            'fee', 'payment_status', 'regular_day', 'regular_time',
            'lesson_method', 'memo', 'created_at', 'updated_at'
        ]

    def get_payment_status(self, obj):
        # 학생 테이블에 payment_status 컬럼이 없어 현재 기본값 유지
        return '대기'

    def get_regular_day(self, obj):
        return ''

    def get_regular_time(self, obj):
        return ''

    def get_lesson_method(self, obj):
        return '대면'


class StudentBillingPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentBillingPolicy
        fields = [
            'id', 'student', 'billing_kind', 'cycle_lesson_count',
            'fee_amount', 'is_active', 'memo', 'created_at'
        ]


class StudentRegularScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.SerializerMethodField()

    class Meta:
        model = StudentRegularSchedule
        fields = [
            'id', 'student', 'day_of_week', 'day_of_week_display',
            'start_time', 'end_time', 'location', 'is_active'
        ]

    def get_day_of_week_display(self, obj):
        days = ['월', '화', '수', '목', '금', '토', '일']
        return days[obj.day_of_week] if 0 <= obj.day_of_week < 7 else ''