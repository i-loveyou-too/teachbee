from rest_framework import serializers
from .models import Payment, PaymentRequest, PaymentRequestClass


class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'student_name']


class PaymentRequestClassSerializer(serializers.ModelSerializer):
    lesson_id = serializers.IntegerField(source='lesson.id', read_only=True)
    lesson_date = serializers.DateField(source='lesson.class_date', read_only=True)

    class Meta:
        model = PaymentRequestClass
        fields = ['id', 'lesson_id', 'lesson_date']


class PaymentRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    classes = PaymentRequestClassSerializer(many=True, read_only=True)

    class Meta:
        model = PaymentRequest
        fields = [
            'id', 'student', 'student_name', 'billing_policy', 'amount',
            'status', 'period_start', 'period_end', 'lesson_count',
            'note', 'created_at', 'paid_at', 'classes'
        ]
        read_only_fields = ['created_at', 'student_name']
