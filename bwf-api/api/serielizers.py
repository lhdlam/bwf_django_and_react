from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Group, Event, UserProfile, Member, Comment, Bet
from django.db.models import Sum
from django.utils import timezone


class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('old_password', 'new_password')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'image', 'is_premium', 'bio')


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        Token.objects.create(user=user)
        return user


class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Member
        fields = ('user', 'group', 'admin')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user', 'group', 'description', 'time')


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'team1', 'team2', 'time', 'group')


class BetSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = Bet
        fields = ('id', 'user', 'event', 'score1', 'score2', 'points')


class EventFullSerializer(serializers.ModelSerializer):
    # bets = BetSerializer(many=True)
    bets = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    num_bets = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'team1', 'team2', 'time', 'score1', 'score2', 'group', 'bets', 'is_admin', 'num_bets')

    def get_num_bets(self, obj):
        no_bets = Bet.objects.filter(event=obj).count()
        return no_bets

    def get_is_admin(self, obj):
        try:
            user = self.context['request'].user
            member = Member.objects.get(group=obj.group, user=user)
            return member.admin
        except:
            return None


    def get_bets(self, obj):
        if obj.time < timezone.now():
            bets = Bet.objects.filter(event=obj)
        else:
            user = self.context['request'].user
            bets = Bet.objects.filter(event=obj, user=user)
        serializer = BetSerializer(bets, many=True)
        return serializer.data


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name', 'location', 'description', 'num_members')


class GroupFullSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True)
    # members = MemberSerializer(many=True)
    members = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ('id', 'name', 'location', 'description', 'events', 'members', 'comments')

    def get_comments(self, obj):
        # comments = Comment.objects.filter(group=obj).order_by('-time')
        comments = obj.comments.order_by('-time')
        serializer = CommentSerializer(comments, many=True)
        return serializer.data

    def get_members(self, obj):
        people_points = []
        members = obj.members.all()
        for member in members:
            points = Bet.objects.filter(event__group=obj, user=member.user.id).aggregate(pts=Sum('points'))
            members_serialized = MemberSerializer(member, many=False)
            member_data = members_serialized.data
            member_data['points'] = points['pts'] or 0

            people_points.append(member_data)
        return people_points
