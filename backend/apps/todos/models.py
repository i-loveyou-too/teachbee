from django.db import models
from apps.students.models import Student
from apps.lessons.models import Lesson

class Task(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, db_column='student_id', null=True, blank=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True, db_column='class_id')
    task_date = models.DateField()
    title = models.CharField(max_length=255)
    task_type = models.CharField(max_length=20, default='custom')
    source_type = models.CharField(max_length=20, default='manual')
    is_completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, default='normal')
    memo = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'tasks' # 실제 DB 테이블 이름
    def __str__(self):
        return self.title
