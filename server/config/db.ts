import { PrismaClient } from '@prisma/client';

function sanitizeDatabaseUrl(url: string | undefined): string {
  if (!url || url.includes('YOUR_HOSTINGER_DB_PASSWORD')) {
    return process.env.SQLITE_URL || 'file:./dev.db';
  }

  const trimmed = url.trim();
  if (!trimmed.startsWith('mysql://')) {
    return trimmed;
  }

  try {
    // Parse using standard URL constructor
    const parsed = new URL(trimmed);
    const username = decodeURIComponent(parsed.username || '');
    let password = decodeURIComponent(parsed.password || '');
    const host = parsed.hostname || 'localhost';
    const port = parsed.port || '3306';
    const database = decodeURIComponent(parsed.pathname ? parsed.pathname.replace(/^\//, '') : '');

    // Remove accidental leading slash from password if present
    if (password.startsWith('/')) {
      password = password.slice(1);
    }

    const encodedPassword = encodeURIComponent(password);
    return `mysql://${username}:${encodedPassword}@${host}:${port}/${database}`;
  } catch {
    // Regex parsing fallback if raw password caused URL syntax error
    const match = trimmed.match(/^mysql:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+)$/);
    if (match) {
      const username = decodeURIComponent(match[1]);
      let password = decodeURIComponent(match[2]);
      if (password.startsWith('/')) {
        password = password.slice(1);
      }
      const host = match[3];
      const port = match[4] || '3306';
      const database = match[5].split('?')[0];

      const encodedPassword = encodeURIComponent(password);
      return `mysql://${username}:${encodedPassword}@${host}:${port}/${database}`;
    }
  }

  return trimmed;
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
  } catch (error: any) {
    console.warn('⚠️ Database Connection Warning:', error?.message || error);
    return false;
  }
}
