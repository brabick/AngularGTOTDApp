import datetime
import random
import string

import pyotp
from django.core.mail import send_mail
from django.shortcuts import render
from rest_framework.authentication import get_authorization_header
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions

from .authentication import create_access_token, create_refresh_token, decode_access_token, JWTAuthentication, \
    decode_refresh_token
from .models import User, UserToken, Reset
from .serializers import UserSerializer, GtotdSerializer


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

    def get(self):
        pass


class RegisterAPIView(APIView):

    def post(self, request):
        data = request.data

        if data['password'] != data['password_confirm']:
            raise exceptions.APIException('Passwords did not match')

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

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

        if not user.tfa_secret:
            raise exceptions.AuthenticationFailed('Invalid credentials')

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
