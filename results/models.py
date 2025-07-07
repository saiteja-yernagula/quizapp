from django.db import models
from quizzes.models import Quiz
from users.models import User

# class Result(models.Model):
#     student = models.ForeignKey(User, on_delete=models.CASCADE)
#     quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
#     score = models.IntegerField()
#     total = models.IntegerField()
#     percentage = models.FloatField()
#     passed = models.BooleanField()
#     attempted_at = models.DateTimeField(auto_now_add=True)
from django.contrib.auth import get_user_model
User = get_user_model()

class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey('quizzes.Quiz', on_delete=models.CASCADE)
    score = models.IntegerField()
    total = models.IntegerField()
    passed = models.BooleanField()
    percentage = models.FloatField(null=True, blank=True)
    attempted_at = models.DateTimeField(auto_now_add=True)
    analysis = models.TextField(blank=True, null=True)  # ✅ ADD THIS
    
    def __str__(self):
        return f"{self.student.username} - {self.quiz.title}"
