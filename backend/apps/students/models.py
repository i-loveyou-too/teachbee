from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    parent_name = models.CharField(max_length=100, null=True, blank=True)
    parent_phone = models.CharField(max_length=20, null=True, blank=True)
    default_location = models.CharField(max_length=255, null=True, blank=True)
    default_class_fee = models.IntegerField(default=0)
    memo = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False      # Django가 테이블을 관리하지 않음
        db_table = 'students'

    def __str__(self):
        return self.name


class StudentBillingPolicy(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='billing_policies')
    billing_kind = models.CharField(max_length=20, default='regular')
    cycle_lesson_count = models.IntegerField(default=4)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    is_active = models.BooleanField(default=True)
    memo = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'student_billing_policies'

    def __str__(self):
        return f'{self.student.name} - {self.billing_kind}'


class StudentRegularSchedule(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='regular_schedules')
    day_of_week = models.IntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True, default='')
    is_active = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'student_regular_schedules'

    def __str__(self):
        return f'{self.student.name} - {self.get_day_of_week_display()}'
