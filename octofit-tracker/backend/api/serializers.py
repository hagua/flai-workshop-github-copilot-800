from rest_framework import serializers
from django.db.models import Sum
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'team_id', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'calories_burned', 'date', 'created_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    total_calories = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'user', 'team', 'total_points', 'total_calories', 'rank', 'updated_at']
    
    def get_user(self, obj):
        try:
            user = User.objects.get(id=obj.user_id)
            return {
                'id': user.id,
                'username': user.username,
                'name': user.name
            }
        except User.DoesNotExist:
            return None
    
    def get_team(self, obj):
        try:
            user = User.objects.get(id=obj.user_id)
            if user.team_id:
                team = Team.objects.get(id=user.team_id)
                return {
                    'id': team.id,
                    'name': team.name
                }
        except (User.DoesNotExist, Team.DoesNotExist):
            pass
        return None
    
    def get_total_calories(self, obj):
        total = Activity.objects.filter(user_id=obj.user_id).aggregate(
            total_calories=Sum('calories_burned')
        )['total_calories']
        return total or 0


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration', 'category']
