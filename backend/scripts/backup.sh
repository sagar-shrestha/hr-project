#!/bin/bash
set -e

BACKUP_DIR="$(dirname "$0")/../backups"
MAX_BACKUPS=10
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/auth_db_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[backup] Creating database backup: $BACKUP_FILE"

if [ -n "$DB_HOST" ]; then
    # Wait for DB to be ready
    echo "[backup] Waiting for database at $DB_HOST:$DB_PORT..."
    for i in $(seq 1 30); do
        if pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" > /dev/null 2>&1; then
            echo "[backup] Database is ready"
            break
        fi
        sleep 2
    done
    pg_dump -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" -d "${DB_NAME:-auth_db}" | gzip > "$BACKUP_FILE"
else
    # Running from host — use docker exec
    docker exec auth_db pg_dump -U postgres -d auth_db | gzip > "$BACKUP_FILE"
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[backup] Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/auth_db_*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    echo "[backup] Rotating old backups (max $MAX_BACKUPS)..."
    ls -t "$BACKUP_DIR"/auth_db_*.sql.gz | tail -n +$((MAX_BACKUPS + 1)) | while read -r old_backup; do
        rm -f "$old_backup"
        echo "[backup] Removed old backup: $old_backup"
    done
fi

echo "[backup] Backup complete"
