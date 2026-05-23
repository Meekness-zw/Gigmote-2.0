import { PrismaClient } from "@prisma/client";

/**
 * Global Prisma client, reused across hot reloads in dev.
 *
 * The default DATABASE_URL points to a local SQLite file checked in via
 * .env. To use Postgres in production, set DATABASE_URL to your
 * connection string and change the `provider` in prisma/schema.prisma.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
