import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/faculty
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response, next) => {
  try {
    const faculty = await prisma.user.findMany({
      where: {
        role: Role.FACULTY,
        instituteId: req.user?.instituteId,
      },
      include: {
        facultyProfile: {
          include: {
            assignedBatches: { include: { course: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/faculty
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN), async (req: AuthRequest, res: Response, next) => {
  try {
    const { email, password, firstName, lastName, phone, employeeId, qualification, designation, specialization } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already in use.' });
    }

    const passwordHash = await bcrypt.hash(password || 'Faculty@123', 10);
    const instituteId = req.user?.instituteId || req.body.instituteId;

    const newFaculty = await prisma.user.create({
      data: {
        instituteId,
        email,
        passwordHash,
        role: Role.FACULTY,
        firstName,
        lastName,
        phone,
        facultyProfile: {
          create: {
            employeeId: employeeId || `EMP-FAC-${Date.now().toString().slice(-4)}`,
            qualification: qualification || 'Master Degree',
            designation: designation || 'Assistant Professor',
            specialization: specialization || 'General Computer Science',
          },
        },
      },
      include: { facultyProfile: true },
    });

    res.status(201).json({ success: true, data: newFaculty });
  } catch (error) {
    next(error);
  }
});

export default router;
