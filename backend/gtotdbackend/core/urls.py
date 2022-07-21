from django.urls import path, include
from .views import RegisterAPIView, LoginAPIView, UserAPIView, RefreshAPIView, LogoutAPIView, \
    ForgotAPIView, ResetAPIView, TwoFactorAPIView, GtotdApiView

urlpatterns = [
    path('register', RegisterAPIView.as_view()),
    path('login', LoginAPIView.as_view()),
    path('two-factor', TwoFactorAPIView.as_view()),
    path('user', UserAPIView.as_view()),
    path('refresh', RefreshAPIView.as_view()),
    path('logout', LogoutAPIView.as_view()),
    path('forgot', ForgotAPIView.as_view()),
    path('reset', ResetAPIView.as_view()),
    path('gtotd', GtotdApiView.as_view()),
]