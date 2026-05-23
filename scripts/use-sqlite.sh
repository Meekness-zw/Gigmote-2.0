#!/usr/bin/env bash
# Switch prisma/schema.prisma back to the SQLite variant (local dev).
set -e
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npx prisma generate
echo "✓ Switched to SQLite schema. Local DB lives at prisma/dev.db."
