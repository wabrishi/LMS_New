import { PrismaClient } from '@prisma/client';

function sanitizeDatabaseUrl(url: string | undefined): string {
  if (!url || url.includes('YOUR_HOSTINGER_DB_PASSWORD')) {
    return process.env.SQLITE_URL || 'file:./dev.db';
  }
  
  try {
    if (url.startsWith('mysql://')) {
      // Parse mysql://user:password@host:port/database
      const firstColon = url.indexOf(':', 8);
      const lastAt = url.lastIndexOf('@');
      
      if (firstColon !== -1 && lastAt !== -1 && firstColon < lastAt) {
        const user = url.substring(8, firstColon);
        const rawPassword = url.substring(firstColon + 1, lastAt);
        const rest = url.substring(lastAt + 1);
        
        // Auto-encode special characters in password (&, #, @, !, $, %)
        const cleanPassword = decodeURIComponent(rawPassword);
        const encodedPassword = encodeURIComponent(cleanPassword);
        
        return `mysql://${user}:${encodedPassword}@${rest}`;
      }
    }
  } catch {
    // Fallback to original URL if parsing fails
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
