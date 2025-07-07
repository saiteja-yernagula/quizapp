from rest_framework import serializers
from .models import Result

class ResultSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'username', 'quiz_title', 'score', 'total', 'percentage', 'passed', 'analysis']

    def get_percentage(self, obj):
        if obj.total == 0:
            return 0
        return round((obj.score / obj.total) * 100, 2)
