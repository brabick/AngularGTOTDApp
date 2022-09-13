import datetime
import random
import string

import pyotp
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions, generics, viewsets

from .authentication import create_access_token, create_refresh_token, decode_access_token, JWTAuthentication, \
    decode_refresh_token
from .models import User, UserToken, Reset, Gtotd, GtotdComment, Profile
from .serializers import UserSerializer, GtotdSerializer, GtotdCommentSerializer, GtotdGetterCommentSerializer, \
    GtotdGetterSerializer, ProfileSerializer
from django.db.models import Q


class GtotdApiView(APIView):

    def post(self, request):
        data = request.data
        if not data['title']:
            return exceptions.APIException('Title cannot be empty')
        if not data['body']:
            return exceptions.APIException('Body cannot be empty')

        """data_new = {
            'title': data['title'],
            'body': data['body'],
            'date_created': data['date_created'],
            'user': user
        }"""
        serializer = GtotdSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def get(self, request):
        queryset = Gtotd.objects.all()
        comments = GtotdComment.objects.all()
        profile = Profile.objects.all()
        id = self.request.query_params.get('id', None)

        if id is not None:
            gtotd = queryset.get(id=id)
            serializer = GtotdSerializer(gtotd)

            pro = profile.filter(user_id=serializer.data['user']).first()

            profile_serializer = ProfileSerializer(pro)


            gtotd_comments = comments.filter(gtotd=id)
            gtotd_result = serializer.data
            gtotd_result['user'] = profile_serializer.data['user_id']
            comments = []
            for c in gtotd_comments:
                comment_serializer = GtotdCommentSerializer(c)
                comments.append(comment_serializer.data)

            results = {
                'image': profile_serializer.data['image'],
                'gtotd': serializer.data,
                'comments': comments
            }

            return Response(results)

        raise exceptions.APIException('GTOTD not found')


class GetGtotdCommentApiView(APIView):

    serializer_class = GtotdCommentSerializer

    def post(self, request):
        data = request.data

        if not data['body']:
            return exceptions.APIException('Body cannot be empty')

        serializer = GtotdCommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    # This will only be used for grabbing single comments going forward
    def get(self, gtotd):
        queryset = GtotdComment.objects.all()

        gtotd = self.request.query_params.get('id', None)

        results = []
        if gtotd is not None:
            good = queryset.filter(gtotd=gtotd)
            for i in good:
                serializer = GtotdGetterCommentSerializer(i)
                results.append(serializer.data)

            return Response(results)

        raise exceptions.APIException('GTOTD not found')


class MultipleGtotdAPIView(APIView):

    def get(self, request):
        queryset = Gtotd.objects.all()
        print("I'm here now")
        results = []
        for q in queryset:

            serializer = GtotdSerializer(q)
            profile = Profile.objects.filter(user_id=serializer.data['user']).first()
            profile_serializer = ProfileSerializer(profile)
            user = User.objects.filter(id=serializer.data['user']).first()
            user_serializer = UserSerializer(user)

            r = serializer.data
            r['image'] = profile_serializer.data['image']
            r['user'] = user_serializer.data['first_name']
            results.append(r)
        return Response(results)


class RegisterAPIView(APIView):

    def post(self, request):
        data = request.data

        if data['password'] != data['password_confirm']:
            raise exceptions.APIException('Passwords did not match')

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        profile = Profile.objects.create(image='/profile_pics/default.jpg', user_id=serializer.data['id'], )
        profile.save()

        profile_serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class LoginAPIView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise exceptions.AuthenticationFailed('Invalid credentials')

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed('Invalid credentials')

        secret = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(10))
        # Displays name of the authenticator app
        otpauth_url = pyotp.totp.TOTP(secret).provisioning_uri(issuer_name='My App')

        send_mail(
            subject='Two Factor Code',
            message='I hope you are trying to log in... use code %s' % secret,
            from_email='fram@example.com',
            recipient_list=[email]
        )
        #code = pyotp.TOTP(secret).digest(secret)

        """if user.tfa_secret:
            return Response({
                'id': user.id,
                'otpauth_url': otpauth_url,
            })"""

        return Response({
            'id': user.id,
            'secret': secret,
            'otpauth_url': otpauth_url,
        })


class TwoFactorAPIView(APIView):
    def post(self, request):
        id = request.data['id']

        user = User.objects.filter(pk=id).first()

        if not user:
            raise exceptions.AuthenticationFailed('Invalid credentials')

        secret = user.tfa_secret if user.tfa_secret !='' else request.data['secret']

        if user.tfa_secret == '':
            user.tfa_secret = secret
            user.save()

        access_token = create_access_token(id)
        refresh_token = create_refresh_token(id)

        UserToken.objects.create(
            user_id=id,
            token=refresh_token,
            expired_at=datetime.datetime.utcnow() + datetime.timedelta(days=7)
        )

        response = Response()
        response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)
        response.data = {
            'token': access_token
        }
        return response


class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProfileAPIView(APIView):

    def post(self, request):
        data = request.data['image']
        user_id = request.data['user_id']
        profile = Profile.objects.create(image=data, user_id=user_id)
        profile.save()
        return Response('created')

    def get(self, id):
        queryset = Profile.objects.all()
        user_queryset = User.objects.all()

        profile = self.request.query_params.get('id', None)
        user = self.request.query_params.get('u', None)
        if profile is not None:
            p = queryset.filter(user_id=profile).first()
            u = user_queryset.filter(id=profile).first()
            profile_serializer = ProfileSerializer(p)
            user_serializer = UserSerializer(u)
            user_info = {
                'user_id': profile,
                'username': user_serializer.data['first_name'],
                'last_name': user_serializer.data['last_name'],
                'image': profile_serializer.data['image'],
                'email': user_serializer.data['email']
            }
            # If there isn't an associated profile picture, use the default
            if user_info['image'] is None:
                user_info['image'] = '/media/profile_pics/default.jpg'

            """ 
            If there isn't a user in the request params (literally anything)
            then we know that we are supposed to also return the gtotds from that
            person. The param was going to be a boolean but it doesn't really
            matter
            """
            if user is None:

                return Response(user_info)
            # Otherwise, grab all of the gtotds from the requested user and return those
            else:
                results = []

                gtotds = Gtotd.objects.filter(user_id=profile)

                for i in gtotds:
                    results.append(GtotdSerializer(i).data)

                response = {
                    'user_information': user_info,
                    'gtotds': results
                }

                return Response(response)

        raise exceptions.APIException('Profile not found')


class SearchGtotdAPIView(APIView):
    model = Gtotd
    serializer_class = GtotdGetterSerializer

    def get(self, request):
        queryset = Gtotd.objects.all()

        user = self.request.query_params.get('u', None)
        results = []
        if user is not None:
            body_search = queryset.filter(
                Q(body__icontains=user) | Q(title__icontains=user) | Q(user__first_name__icontains=user))
            print(body_search)
            if body_search is not None:
                for i in body_search:
                    print(i)
                    serializer = GtotdGetterSerializer(i)
                    results.append(serializer.data)

            """
                    if user is not None:
            body_search = queryset.filter(body__icontains=user)
            print(body_search)
            if body_search is not None:
                for i in body_search:
                    print(i)
                    serializer = GtotdGetterSerializer(i)
                    results.append(serializer.data)

            title_search = queryset.filter(title__icontains=user)
            print(title_search)
            if title_search is not None:
                for i in title_search:
                    if i not in results:
                        print(i)
                        serializer = UserSerializer(i)
                        results.append(serializer.data)"""

            return Response(results)

        raise exceptions.APIException('No users found')


class RefreshAPIView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        id = decode_refresh_token(refresh_token)

        if not UserToken.objects.filter(
                user_id=id,
                token=refresh_token,
                expired_at__gt=datetime.datetime.now(tz=datetime.timezone.utc)
        ).exists():

            raise exceptions.AuthenticationFailed('Unauthenticated')
        access_token = create_access_token(id)

        return Response({
            'token': access_token
        })


class LogoutAPIView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        UserToken.objects.filter(token=refresh_token).delete()
        response = Response()
        response.delete_cookie(key='refresh_token')
        response.data = {
            'message': 'Success'
        }

        return response


class ForgotAPIView(APIView):
    def post(self, request):
        token = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(10))
        email = request.data['email']
        Reset.objects.create(
            email=request.data['email'],
            token=token
        )

        url = 'http://localhost:4200/reset/' + token

        send_mail(
            subject='Reset password',
            message='Click <a href="%s">here</a> to reset password.' % url,
            from_email='fram@example.com',
            recipient_list=[email]
        )

        return Response({
            'message': 'success'
        })


class ResetAPIView(APIView):
    def post(self, request):
        data = request.data

        if data['password'] != data['password_confirm']:
            raise exceptions.APIException('Passwords did not match')
        reset_password = Reset.objects.filter(token=data['token']).first()

        if not reset_password:
            raise exceptions.APIException('Invalid Link')

        user = User.objects.filter(email=reset_password.email).first()

        if not user:
            raise exceptions.APIException('User not found')

        user.set_password(data['password'])
        user.save()

        return Response({
            'message': 'success'
        })
