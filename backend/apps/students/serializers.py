from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    fee = serializers.IntegerField(source='default_class_fee')
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
        # 기본값: '대기'
        return '대기'

    def get_regular_day(self, obj):
        # DB에 없는 필드, 기본값: 빈 문자열
        return ''

    def get_regular_time(self, obj):
        # DB에 없는 필드, 기본값: 빈 문자열
        return ''

    def get_lesson_method(self, obj):
        # DB에 없는 필드, 기본값: '대면'
        return '대면'