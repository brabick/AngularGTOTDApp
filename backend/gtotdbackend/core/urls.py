from django.urls import path, include, re_path
from .views import RegisterAPIView, LoginAPIView, UserAPIView, RefreshAPIView, LogoutAPIView, \
    ForgotAPIView, ResetAPIView, TwoFactorAPIView, GtotdApiView, GetGtotdCommentApiView, MultipleGtotdAPIView, \
    SearchGtotdAPIView, ProfileAPIView
from django.conf import settings
from django.conf.urls.static import static


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
    path('gtotd/<int:id>', GtotdApiView.as_view()),
    path('comments', GetGtotdCommentApiView.as_view()),
    path('comments/<int:id>/', GetGtotdCommentApiView.as_view()),
    # don't forget that if you're adding a url with a parameter
    # you need a base url as well
    path('searchgtotd', SearchGtotdAPIView.as_view()),
    path('searchgtotd/<str:u>/', SearchGtotdAPIView.as_view()),
    path('profile', ProfileAPIView.as_view()),
    path('profile/<str:id>', ProfileAPIView.as_view()),
    path('profile/<str:id>/<str:u>', ProfileAPIView.as_view()),
    path('gtotds', MultipleGtotdAPIView.as_view({'get': 'list'})),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
