import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  // Default secret for dev only - Fail in production if missing
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_for_dev_only',
  DATABASE_URL: process.env.DATABASE_URL,
};

// Strict check for Production
if (env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  throw new Error(
    '❌ FATAL: DATABASE_URL is missing in production environment',
  );
}

if (!process.env.JWT_SECRET && env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  WARNING: JWT_SECRET is not defined in .env. Using default.',
  );
}
