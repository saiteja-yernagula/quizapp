from django.urls import path
from .views import (
    AdminAllResultsView,
    AdminQuizResultsView,
    AdminStudentResultsView,
    StudentResultView,
)

urlpatterns = [
    path('admin/results/', AdminAllResultsView.as_view(), name='admin-all-results'),
    path('admin/results/quiz/<int:quiz_id>/', AdminQuizResultsView.as_view(), name='admin-quiz-results'),
    path('admin/results/student/<int:student_id>/', AdminStudentResultsView.as_view(), name='admin-student-results'),
    path("student/results/", StudentResultView.as_view(), name="student-results"),  # ✅ correct usage
]