import { Router, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/batches
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response, next) => {
  try {
    const batches = await prisma.batch.findMany({
      where: req.user?.instituteId ? { instituteId: req.user.instituteId } : undefined,
      include: {
        course: true,
        faculty: { include: { user: true } },
        enrollments: { include: { student: { include: { user: true } } } },
        liveClasses: true,
        assignments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: batches });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/batches
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { courseId, facultyId, name, capacity, startDate, endDate } = req.body;

    const batch = await prisma.batch.create({
      data: {
        instituteId: req.user?.instituteId!,
        courseId,
        facultyId: facultyId || null,
        name,
        capacity: parseInt(capacity, 10) || 50,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: { course: true, faculty: true },
    });

    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/batches/:batchId/enroll
router.post('/:batchId/enroll', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN), async (req: AuthRequest, res: Response, next) => {
  try {
    const { studentProfileId } = req.body;

    const enrollment = await prisma.batchEnrollment.create({
      data: {
        batchId: req.params.batchId,
        studentId: studentProfileId,
      },
      include: { batch: true, student: true },
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
});

export default router;
