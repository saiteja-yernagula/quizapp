from django.contrib import admin
from .models import Result

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'get_percentage', 'passed','attempted_at']
    list_filter = ['quiz', 'passed']
    search_fields = ['user__username', 'quiz__title']

    def get_percentage(self, obj):
        if obj.total == 0:
            return "0%"
        return f"{round((obj.score / obj.total) * 100)}%"

    get_percentage.short_description = "Percentage"
