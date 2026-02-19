from django.db import models


class User(models.Model):
    username = models.CharField(max_length=50, unique=True, default='user')
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    team_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'teams'
    
    def __str__(self):
        return self.name


class Activity(models.Model):
    user_id = models.IntegerField()
    activity_type = models.CharField(max_length=50)
    duration = models.IntegerField()  # in minutes
    calories_burned = models.IntegerField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activities'
        verbose_name_plural = 'activities'
    
    def __str__(self):
        return f"{self.activity_type} - {self.duration}min"


class Leaderboard(models.Model):
    user_id = models.IntegerField()
    total_points = models.IntegerField(default=0)
    rank = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']
    
    def __str__(self):
        return f"Rank {self.rank} - {self.total_points} points"


class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    difficulty = models.CharField(max_length=20)
    duration = models.IntegerField()  # in minutes
    category = models.CharField(max_length=50)
    
    class Meta:
        db_table = 'workouts'
    
    def __str__(self):
        return self.name

