from django.core.management.base import BaseCommand
from api.models import User, Team, Activity, Leaderboard, Workout
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data cleared'))
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes working together to achieve peak fitness'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='The Justice League maintaining superhuman strength and endurance'
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create Users - Marvel Heroes
        self.stdout.write('Creating Marvel heroes...')
        marvel_users = [
            {'username': 'ironman', 'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'password': 'arc_reactor_3000'},
            {'username': 'captainamerica', 'name': 'Steve Rogers', 'email': 'captainamerica@marvel.com', 'password': 'shield_bearer'},
            {'username': 'thor', 'name': 'Thor Odinson', 'email': 'thor@asgard.com', 'password': 'mjolnir_worthy'},
            {'username': 'blackwidow', 'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'password': 'red_ledger'},
            {'username': 'hulk', 'name': 'Bruce Banner', 'email': 'hulk@marvel.com', 'password': 'smash_time'},
            {'username': 'spiderman', 'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'password': 'web_slinger'},
        ]
        
        marvel_user_objects = []
        for user_data in marvel_users:
            user = User.objects.create(
                username=user_data['username'],
                name=user_data['name'],
                email=user_data['email'],
                password=user_data['password'],
                team_id=team_marvel.id
            )
            marvel_user_objects.append(user)
            self.stdout.write(f'  Created {user.name} (@{user.username})')
        
        # Create Users - DC Heroes
        self.stdout.write('Creating DC heroes...')
        dc_users = [
            {'username': 'superman', 'name': 'Clark Kent', 'email': 'superman@dc.com', 'password': 'kryptonite_free'},
            {'username': 'batman', 'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'password': 'dark_knight'},
            {'username': 'wonderwoman', 'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'password': 'lasso_truth'},
            {'username': 'flash', 'name': 'Barry Allen', 'email': 'flash@dc.com', 'password': 'speed_force'},
            {'username': 'aquaman', 'name': 'Arthur Curry', 'email': 'aquaman@dc.com', 'password': 'trident_power'},
            {'username': 'greenlantern', 'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'password': 'will_power'},
        ]
        
        dc_user_objects = []
        for user_data in dc_users:
            user = User.objects.create(
                username=user_data['username'],
                name=user_data['name'],
                email=user_data['email'],
                password=user_data['password'],
                team_id=team_dc.id
            )
            dc_user_objects.append(user)
            self.stdout.write(f'  Created {user.name} (@{user.username})')
        
        all_users = marvel_user_objects + dc_user_objects
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Swimming', 'Cycling', 'Weightlifting', 'Yoga', 'Boxing', 'HIIT']
        activities_count = 0
        
        for user in all_users:
            # Each user gets 5-10 random activities over the past 30 days
            num_activities = random.randint(5, 10)
            for _ in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                calories = duration * random.randint(5, 12)
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_id=user.id,
                    activity_type=activity_type,
                    duration=duration,
                    calories_burned=calories,
                    date=date.today() - timedelta(days=days_ago)
                )
                activities_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {activities_count} activities'))
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = []
        
        for user in all_users:
            # Calculate total points based on activities
            user_activities = Activity.objects.filter(user_id=user.id)
            total_points = sum(activity.calories_burned for activity in user_activities)
            leaderboard_data.append({
                'user_id': user.id,
                'total_points': total_points,
                'name': user.name
            })
        
        # Sort by total points descending
        leaderboard_data.sort(key=lambda x: x['total_points'], reverse=True)
        
        # Create leaderboard entries with ranks
        for rank, entry in enumerate(leaderboard_data, start=1):
            Leaderboard.objects.create(
                user_id=entry['user_id'],
                total_points=entry['total_points'],
                rank=rank
            )
            self.stdout.write(f'  Rank {rank}: {entry["name"]} - {entry["total_points"]} points')
        
        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts = [
            {
                'name': 'Super Soldier Training',
                'description': 'Captain America\'s legendary workout routine for peak human performance',
                'difficulty': 'Advanced',
                'duration': 60,
                'category': 'Strength'
            },
            {
                'name': 'Asgardian Power Lifting',
                'description': 'Thor\'s mighty lifting routine to build god-like strength',
                'difficulty': 'Expert',
                'duration': 90,
                'category': 'Strength'
            },
            {
                'name': 'Speed Force Sprint',
                'description': 'Flash\'s high-intensity sprint training for maximum speed',
                'difficulty': 'Advanced',
                'duration': 30,
                'category': 'Cardio'
            },
            {
                'name': 'Batcave HIIT',
                'description': 'Batman\'s intense interval training for vigilante readiness',
                'difficulty': 'Advanced',
                'duration': 45,
                'category': 'HIIT'
            },
            {
                'name': 'Amazonian Warrior Yoga',
                'description': 'Wonder Woman\'s flexibility and balance training',
                'difficulty': 'Intermediate',
                'duration': 50,
                'category': 'Flexibility'
            },
            {
                'name': 'Web-Swinging Cardio',
                'description': 'Spider-Man\'s agility and endurance workout',
                'difficulty': 'Intermediate',
                'duration': 40,
                'category': 'Cardio'
            },
            {
                'name': 'Atlantean Swim Session',
                'description': 'Aquaman\'s underwater resistance training',
                'difficulty': 'Advanced',
                'duration': 60,
                'category': 'Swimming'
            },
            {
                'name': 'Arc Reactor Core',
                'description': 'Iron Man\'s core strengthening routine',
                'difficulty': 'Intermediate',
                'duration': 35,
                'category': 'Core'
            },
        ]
        
        for workout_data in workouts:
            workout = Workout.objects.create(**workout_data)
            self.stdout.write(f'  Created {workout.name}')
        
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Teams: {Team.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Users: {User.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Activities: {Activity.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Leaderboard Entries: {Leaderboard.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Workouts: {Workout.objects.count()}'))
