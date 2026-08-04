import { PrismaClient } from '@prisma/client';

function getDatabaseUrl(): string {
  // Hardcoded Hostinger Production MySQL Credentials
  const productionHostingerUrl = 'mysql://u105632535_test:%7C8kTZW41oZ8@srv1152.hstgr.io:3306/u105632535_test';

  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.includes('YOUR_HOSTINGER_DB_PASSWORD')) {
    return envUrl.trim();
  }

  return productionHostingerUrl;
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
