from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,       # For login
    TokenRefreshView,          # For refreshing access token
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ Quiz-related APIs (from quizzes/urls.py)
    path('api/', include('quizzes.urls')),

    # ✅ User registration, e.g., /api/users/register/
    path('api/users/', include('users.urls')),

    # ✅ JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login endpoint
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token endpoint
    # path('api/results/', include('results.urls')),
    path("api/", include("results.urls")),  # ✅ Add this li

]
