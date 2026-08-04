import { Router, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/courses
router.get('/', async (_req: AuthRequest, res: Response, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
        },
        modules: {
          include: { lessons: true },
          orderBy: { orderIndex: 'asc' },
        },
        _count: { select: { batches: true, quizzes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/courses
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { title, category, price, durationHours, description, thumbnailUrl } = req.body;

    const course = await prisma.course.create({
      data: {
        instituteId: req.user?.instituteId!,
        instructorId: req.user?.id!,
        title,
        category,
        price: parseFloat(price) || 0,
        durationHours: parseInt(durationHours, 10) || 0,
        description: description || '',
        thumbnailUrl: thumbnailUrl || null,
        isPublished: true,
      },
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/courses/:id
router.get('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        modules: {
          include: { lessons: true },
          orderBy: { orderIndex: 'asc' },
        },
        quizzes: true,
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

export default router;
