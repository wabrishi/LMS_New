import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ MySQL Database connected successfully via Prisma Client');
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    process.exit(1);
  }
}
