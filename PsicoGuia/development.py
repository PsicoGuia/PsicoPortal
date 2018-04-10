from PsicoGuia.settings import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'development',
        'USER': 'psico',
        'PASSWORD': 'ps1c0gu14',
        'HOST': 'localhost',
        'PORT': '5432',
        #'OPTIONS': {'isolation_level': psycopg2.extensions.ISOLATION_LEVEL_SERIALIZABLE,},
    }
}
