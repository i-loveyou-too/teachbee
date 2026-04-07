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
