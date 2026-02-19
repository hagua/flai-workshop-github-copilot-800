from django.shortcuts import render
from django.http import JsonResponse
import os


def api_root(request):
    """Root view that displays available API endpoints"""
    codespace_name = os.getenv('CODESPACE_NAME')
    
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
    
    endpoints = {
        "message": "Welcome to OctoFit Tracker API",
        "endpoints": {
            "users": f"{base_url}/api/users/",
            "teams": f"{base_url}/api/teams/",
            "activities": f"{base_url}/api/activities/",
            "leaderboard": f"{base_url}/api/leaderboard/",
            "workouts": f"{base_url}/api/workouts/",
            "admin": f"{base_url}/admin/",
        }
    }
    
    return JsonResponse(endpoints, json_dumps_params={'indent': 2})
