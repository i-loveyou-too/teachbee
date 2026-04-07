from .base import *  # noqa

DEBUG = False

# 프로덕션에서는 ALLOWED_HOSTS 명시
ALLOWED_HOSTS = ['your-domain.com']

# 보안 설정
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
