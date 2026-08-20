#!/bin/sh
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting server on port ${PORT:-8000}..."
exec gunicorn app.main:app \
    --workers 2 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind "0.0.0.0:${PORT:-8000}" \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
