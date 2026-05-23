#!/usr/bin/env bash
# Switch prisma/schema.prisma to the Postgres variant (for Vercel / production).
set -e
cp prisma/schema.postgres.prisma prisma/schema.prisma
npx prisma generate
echo "✓ Switched to Postgres schema."
echo "  Next: npx prisma migrate deploy  (against your prod DATABASE_URL)"
