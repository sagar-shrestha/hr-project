#!/bin/bash
set -e

SCRIPT_DIR="$(dirname "$0")"

echo "=== Running database backup before starting services ==="
"$SCRIPT_DIR/backup.sh"

echo ""
echo "=== Starting Docker Compose services ==="
docker compose up --build -d
