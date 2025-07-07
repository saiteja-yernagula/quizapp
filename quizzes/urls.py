from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuizViewSet,
    # QuestionViewSet,
    RegisterView,
    QuizDetailView,
    # submit_quiz,
    QuizListAPIView,
    AdminQuizViewSet,
    ExcelUploadView,
)
from .views import AdminRegisterView
from .views import ProfileView
router = DefaultRouter()
router.register('quizzes', QuizViewSet)
router.register('admin/quizzes', AdminQuizViewSet, basename='admin-quizzes')
# router.register('questions', QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),  # This gives /quizzes/ and /questions/
    path('register/', RegisterView.as_view(), name='register'),
    path('quiz-list/', QuizListAPIView.as_view(), name='quiz-list'),  # Optional alternative list view
    
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'), 
    path('', include(router.urls)),
    path('admin/upload-excel/', ExcelUploadView.as_view(), name='quiz-excel-upload'),
    path("api/", include("results.urls")),  # ✅ Include results app URLs here
    path("admin/register/", AdminRegisterView.as_view(), name="admin-register"),
    path('profile/', ProfileView.as_view(), name='profile'),

]
urlpatterns += router.urls