import { PrismaClient } from '@prisma/client';
import { env } from './env';

// 1. Define global type safely
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Validate URL exists before passing it (Fixes 'string | undefined' error)
const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  } as any);

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
