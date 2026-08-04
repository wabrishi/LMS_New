import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes('YOUR_HOSTINGER_DB_PASSWORD')) {
    return process.env.SQLITE_URL || 'file:./dev.db';
  }
  return url.trim();
}

const dbUrl = getDatabaseUrl();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ MySQL Database connected successfully via Prisma Client');
    return true;
  } catch (error: any) {
    console.warn('⚠️ Database Connection Warning:', error?.message || error);
    return false;
  }
}
