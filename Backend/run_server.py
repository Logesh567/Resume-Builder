#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    try:
        print("Setting up Django...")
        django.setup()
        print(f"DEBUG: {settings.DEBUG}")
        print(f"ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
        print("Starting server...")
        execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
