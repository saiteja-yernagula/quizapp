from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model

from .models import Quiz, Question, Option
from .serializers import QuizSerializer, QuestionSerializer, QuizDetailSerializer,QuizCreateSerializer
from rest_framework import viewsets, permissions
from .models import Quiz
from results.models import Result  # Add this import at the top


User = get_user_model()

class QuizListAPIView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(is_published=True)
    
# ✅ Main ViewSet for quizzes
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.filter(is_published=True)
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizSerializer

    # ✅ Custom action for quiz submission
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get('answers', {})  # {question_id: selected_option_id}

        score = 0
        total = quiz.questions.count()
        correct_answers = {}

        for question in quiz.questions.all():
            correct_option = question.options.filter(is_correct=True).first()
            selected_option_id = answers.get(str(question.id))

            if correct_option:
                correct_answers[str(question.id)] = correct_option.id
                if str(correct_option.id) == str(selected_option_id):
                    score += 1

        percentage = round((score / total) * 100, 2) if total else 0
        passed = score >= (total // 2)

        # ✅ Save result to DB
        Result.objects.create(
            user=request.user,
            quiz=quiz,
            score=score,
            total=total,
            passed=passed,
            analysis=correct_answers  # optionally storing correct answers as JSON
        )

        return Response({
            "message": f"You scored {score} out of {total}",
            "score": score,
            "total": total,
            "score_percentage": percentage,
            "correct_answers": correct_answers
        })

class AdminQuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return QuizDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return QuizCreateSerializer
        return QuizSerializer  # fallback

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    

# ✅ User Registration View (no login required)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, password=password)
        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED
        )


# ✅ Authenticated detail view for a single quiz with questions and options
class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.prefetch_related('questions__options')
    serializer_class = QuizDetailSerializer
    permission_classes = [IsAuthenticated]



import pandas as pd
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from .models import Quiz, Question, Option
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAdminUser


class ExcelUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get('file')

        if not excel_file.name.endswith('.xlsx'):
            return Response({'error': 'Please upload an Excel (.xlsx) file.'}, status=400)

        try:
            df = pd.read_excel(excel_file)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

        required_columns = ['title', 'subject', 'duration', 'question_text', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_option']
        if not all(col in df.columns for col in required_columns):
            return Response({'error': f'Missing columns. Required: {required_columns}'}, status=400)

        grouped = df.groupby(['title', 'subject', 'duration'])

        for (title, subject, duration), group in grouped:
            quiz = Quiz.objects.create(
                title=title,
                subject=subject,
                duration=int(duration),
                created_by=request.user,
                start_time=timezone.now(),
                end_time=timezone.now() + timedelta(minutes=int(duration)),
                is_published=True
            )

            for _, row in group.iterrows():
                question = Question.objects.create(quiz=quiz, text=row['question_text'])
                for i in range(1, 5):
                    Option.objects.create(
                        question=question,
                        text=row[f'option_{i}'],
                        is_correct=(row['correct_option'] == i)
                    )

        return Response({'message': 'Excel uploaded and quiz created successfully.'}, status=status.HTTP_201_CREATED)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

User = get_user_model()

class AdminRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                is_staff=True,   # ✅ Mark as admin
                is_superuser=True  # Optional
            )
            return Response({"message": "Admin registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_staff or user.is_superuser,
        })
