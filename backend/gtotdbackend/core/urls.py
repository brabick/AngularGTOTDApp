from django.urls import path, include, re_path
from .views import RegisterAPIView, LoginAPIView, UserAPIView, RefreshAPIView, LogoutAPIView, \
    ForgotAPIView, ResetAPIView, TwoFactorAPIView, GtotdApiView, MultipleGtotdAPIView

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
    path('gtotd/', GtotdApiView.as_view()),
    re_path('^gtotd/(?P<id>.+)/$', GtotdApiView.as_view()),
    path('gtotds', MultipleGtotdAPIView.as_view({'get': 'list'})),
]