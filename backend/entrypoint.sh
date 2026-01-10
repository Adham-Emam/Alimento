#!/bin/sh
set -e

echo "Waiting for database..."
sleep 5

if [ "$RUN_MIGRATIONS" = "1" ]; then
  python manage.py migrate --noinput
  python manage.py collectstatic --noinput
fi

exec "$@"