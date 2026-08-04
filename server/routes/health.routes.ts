import { Router, Request, Response } from 'express';
import { prisma } from '../config/db';

const router = Router();

// GET /api/v1/health
router.get('/', async (_req: Request, res: Response) => {
  try {
    const dbResult = await prisma.$queryRaw`SELECT 1 as alive`;
    res.json({
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'MySQL connected',
      dbQuery: dbResult,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'MySQL connection failed',
      error: error.message,
    });
  }
});

export default router;
