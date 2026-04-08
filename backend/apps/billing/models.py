from django.db import models
from apps.students.models import Student, StudentBillingPolicy
from apps.lessons.models import Lesson

class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, db_column='student_id')
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True, db_column='class_id')
    amount = models.IntegerField()
    status = models.CharField(max_length=20, default='unpaid')
    due_date = models.DateField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    memo = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'payments' # 실제 DB 테이블 이름

    def __str__(self):
        return f'{self.student.name} - {self.amount:,}원 ({self.status})'


class PaymentRequest(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payment_requests')
    billing_policy = models.ForeignKey(StudentBillingPolicy, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    status = models.CharField(max_length=20, default='pending')
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    lesson_count = models.IntegerField(default=0)
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'payment_requests'

    def __str__(self):
        return f'{self.student.name} - {self.amount:,}원 ({self.status})'


class PaymentRequestClass(models.Model):
    payment_request = models.ForeignKey(PaymentRequest, on_delete=models.CASCADE, related_name='classes')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'payment_request_classes'

    def __str__(self):
        return f'{self.payment_request.id} - {self.lesson.id}'
