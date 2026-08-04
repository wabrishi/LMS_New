import { PrismaClient } from '@prisma/client';

function sanitizeDatabaseUrl(url: string | undefined): string {
  if (!url || url.includes('YOUR_HOSTINGER_DB_PASSWORD')) {
    return process.env.SQLITE_URL || 'file:./dev.db';
  }
  
  try {
    if (url.startsWith('mysql://')) {
      const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@(.+)$/);
      if (match) {
        const [, user, password, rest] = match;
        // URL-encode password in case it contains special characters like #, @, !, $, %
        const encodedPassword = encodeURIComponent(decodeURIComponent(password));
        return `mysql://${user}:${encodedPassword}@${rest}`;
      }
    }
  } catch {
    // Fallback to original URL if regex fails
  }
  
  return url;
}

const dbUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);

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
  } catch (error) {
    console.warn('⚠️ Database Connection Warning:', error);
    return false;
  }
}
