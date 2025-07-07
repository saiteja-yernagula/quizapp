from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from quizzes.models import Quiz, Question, Option
from .models import Result
from .serializers import ResultSerializer
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions
from .models import Result
# from .serializers import StudentResultSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Result
# from .serializers import StudentResultSerializer
User = get_user_model()

class StudentResultView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Result.objects.filter(user=self.request.user)
    

# ✅ Admin: View all results
class AdminAllResultsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        results = Result.objects.select_related('user', 'quiz')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)


# ✅ Admin: View results by quiz
class AdminQuizResultsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, quiz_id):
        results = Result.objects.filter(quiz_id=quiz_id).select_related('student')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)


# ✅ Admin: View results by student
class AdminStudentResultsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, student_id):
        results = Result.objects.filter(student_id=student_id).select_related('quiz')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)
