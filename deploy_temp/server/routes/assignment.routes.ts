import { Router, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/assignments
router.get('/', authenticateJWT, async (_req: AuthRequest, res: Response, next) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        batch: { include: { course: true } },
        submissions: { include: { student: { include: { user: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/assignments
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { batchId, title, description, maxMarks, dueDate, attachmentUrl } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        batchId,
        title,
        description,
        maxMarks: parseInt(maxMarks, 10) || 100,
        dueDate: new Date(dueDate),
        attachmentUrl,
      },
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/assignments/:id/submit
router.post('/:id/submit', authenticateJWT, authorizeRoles(Role.STUDENT), async (req: AuthRequest, res: Response, next) => {
  try {
    const { fileUrl } = req.body;
    const studentUser = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { studentProfile: true },
    });

    if (!studentUser?.studentProfile) {
      return res.status(400).json({ success: false, message: 'Student profile not found.' });
    }

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: req.params.id,
          studentId: studentUser.studentProfile.id,
        },
      },
      update: {
        fileUrl,
        submittedAt: new Date(),
      },
      create: {
        assignmentId: req.params.id,
        studentId: studentUser.studentProfile.id,
        fileUrl,
      },
    });

    res.json({ success: true, message: 'Assignment submitted successfully', data: submission });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/assignments/submissions/:submissionId/grade
router.post('/submissions/:submissionId/grade', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { marks, feedback } = req.body;

    const graded = await prisma.assignmentSubmission.update({
      where: { id: req.params.submissionId },
      data: {
        marks: parseFloat(marks),
        feedback,
        gradedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'Submission graded successfully', data: graded });
  } catch (error) {
    next(error);
  }
});

export default router;
