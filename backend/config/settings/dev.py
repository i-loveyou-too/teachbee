from .base import *  # noqa

DEBUG = True

# 개발용: SQLite fallback (PostgreSQL 없을 때)
import os
if os.getenv('USE_SQLITE', 'False') == 'True':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# 개발용: 모든 origin 허용
CORS_ALLOW_ALL_ORIGINS = True

# django-debug-toolbar (선택)
# INSTALLED_APPS += ['debug_toolbar']
