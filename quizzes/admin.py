
from django.contrib import admin
from .models import Quiz, Question, Option  # or whatever your model names are

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Option)
