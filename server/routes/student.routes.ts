import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/students
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response, next) => {
  try {
    const { page = '1', limit = '10', search, status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      role: Role.STUDENT,
    };

    if (req.user?.instituteId) {
      whereClause.instituteId = req.user.instituteId;
    }

    if (status) {
      whereClause.status = status as any;
    }

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        include: {
          studentProfile: {
            include: {
              enrollments: {
                include: { batch: { include: { course: true } } },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/students
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN), async (req: AuthRequest, res: Response, next) => {
  try {
    const { email, password, firstName, lastName, phone, rollNumber, parentName, parentContact } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }

    const passwordHash = await bcrypt.hash(password || 'Student@123', 10);
    const instituteId = req.user?.instituteId || req.body.instituteId;

    const newStudent = await prisma.user.create({
      data: {
        instituteId,
        email,
        passwordHash,
        role: Role.STUDENT,
        firstName,
        lastName,
        phone,
        studentProfile: {
          create: {
            rollNumber: rollNumber || `STU-${Date.now().toString().slice(-6)}`,
            parentName,
            parentContact,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/students/:id
router.get('/:id', authenticateJWT, async (req: AuthRequest, res: Response, next) => {
  try {
    const student = await prisma.user.findFirst({
      where: { id: req.params.id, role: Role.STUDENT },
      include: {
        studentProfile: {
          include: {
            enrollments: { include: { batch: true } },
            submissions: true,
            quizAttempts: true,
            invoices: true,
            certificates: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

export default router;
