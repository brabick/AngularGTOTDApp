from rest_framework.fields import ReadOnlyField
from rest_framework.serializers import ModelSerializer
from .models import User, Gtotd, GtotdComment


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'image']
        extra_kwargs = {
            'password':
                {'write_only': True}
        }

    def create(self, validated_data):
        # Extract password
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        # Set the password
        if password is not None:
            instance.set_password(password)
        # Save
        instance.save()
        # Return without the password
        return instance


class GtotdSerializer(ModelSerializer):

    class Meta:
        model = Gtotd
        fields = ['id', 'title', 'body', 'date_created', 'user']

class GtotdGetterSerializer(ModelSerializer):

    user = ReadOnlyField(source='user.first_name', read_only=True)

    class Meta:
        model = Gtotd
        fields = ['id', 'title', 'body', 'date_created', 'user']


class GtotdCommentSerializer(ModelSerializer):

    class Meta:
        model = GtotdComment
        fields = ['gtotd', 'body', 'date_created', 'user']


class GtotdGetterCommentSerializer(ModelSerializer):

    user = ReadOnlyField(source='user.first_name', read_only=True)

    class Meta:
        model = GtotdComment
        fields = ['gtotd', 'body', 'date_created', 'user']