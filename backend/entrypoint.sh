#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."

# Better database wait - retry until connected
until PGPASSWORD=$DB_PASSWORD psql -h "${DB_HOST:-postgres}" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  echo "PostgreSQL unavailable - waiting..."
  sleep 2
done

echo "PostgreSQL ready!"

# Run migrations
if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "Running migrations..."
  python manage.py migrate --noinput
  
  echo "Collecting static files..."
  python manage.py collectstatic --noinput
  
  # Create superuser if it doesn't exist
  echo "Creating superuser if needed..."
  python manage.py shell << END
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@alimento.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created successfully!')
else:
    print(f'Superuser {username} already exists.')
END
fi

echo "Starting application..."
exec "$@"