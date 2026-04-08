from django.db import models
from apps.students.models import Student

class Lesson(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, db_column='student_id')
    class_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    subject = models.CharField(max_length=100)
    location = models.CharField(max_length=255, null=True, blank=True)
    class_mode = models.CharField(max_length=20, default='offline')
    status = models.CharField(max_length=20, default='scheduled')
    payment_status = models.CharField(max_length=20, default='unpaid')
    homework_checked = models.BooleanField(default=False)
    prep_checked = models.BooleanField(default=False)
    memo = models.TextField(null=True, blank=True)
    origin_class = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, db_column='origin_class_id')
    billing_kind = models.CharField(max_length=20, default='regular')
    related_class_id = models.IntegerField(null=True, blank=True)
    makeup_pricing_mode = models.CharField(max_length=20, default='free')
    makeup_fee_amount = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
    counts_toward_cycle = models.BooleanField(default=True)
    absence_pricing_mode = models.CharField(max_length=20, default='charge')
    reschedule_mode = models.CharField(max_length=20, default='move')
    original_class_date = models.DateField(null=True, blank=True)
    change_reason = models.TextField(blank=True, default='')
    billing_note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'classes'

    def __str__(self):
        return f'{self.student.name} - {self.class_date} {self.start_time}'


class CancelMakeup(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name='cancel_makeups', verbose_name='학생'
    )
    original_lesson = models.ForeignKey(
        Lesson, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='cancel_record', verbose_name='원본 수업'
    )
    cancel_date = models.DateField('결강 날짜')
    cancel_reason = models.TextField('결강 사유', blank=True)
    makeup_date = models.DateField('보강 날짜', null=True, blank=True)
    makeup_done = models.BooleanField('보강 완료', default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = '결강/보강'
        verbose_name_plural = '결강/보강 목록'
        ordering = ['-cancel_date']

    def __str__(self):
        return f'{self.student.name} 결강 {self.cancel_date}'
