from django.db import models
from apps.students.models import Student
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
