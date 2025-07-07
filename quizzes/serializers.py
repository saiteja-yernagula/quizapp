from rest_framework import serializers
from .models import Quiz, Question, Option
from django.utils import timezone
from datetime import timedelta
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'options']

class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'subject', 'duration', 'start_time', 'end_time', 'is_published', 'questions']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'subject', 'duration', 'start_time', 'end_time', 'is_published']

class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['title', 'subject', 'duration', 'start_time', 'end_time', 'is_published', 'questions']

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None

        questions_data = validated_data.pop('questions')

        # ✅ start_time and end_time will now be present from validated_data
        quiz = Quiz.objects.create(created_by=user, **validated_data)

        for question_data in questions_data:
            options_data = question_data.pop('options')
            question = Question.objects.create(quiz=quiz, **question_data)
            for opt in options_data:
                Option.objects.create(question=question, **opt)

        return quiz



    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        instance.title = validated_data.get('title', instance.title)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.save()

        # Delete old questions & options
        instance.questions.all().delete()

        for question_data in questions_data:
            options_data = question_data.pop('options')
            question = Question.objects.create(quiz=instance, **question_data)
            for opt in options_data:
                Option.objects.create(question=question, **opt)

        return instance
