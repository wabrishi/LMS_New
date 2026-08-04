import { Router, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/live-classes
router.get('/', authenticateJWT, async (_req: AuthRequest, res: Response, next) => {
  try {
    const liveClasses = await prisma.liveClass.findMany({
      include: {
        batch: {
          include: {
            course: true,
            faculty: { include: { user: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json({ success: true, data: liveClasses });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/live-classes
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { batchId, title, platform, meetingLink, meetingId, passcode, scheduledAt, durationMinutes } = req.body;

    const newClass = await prisma.liveClass.create({
      data: {
        batchId,
        title,
        platform: platform || 'ZOOM',
        meetingLink,
        meetingId,
        passcode,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: parseInt(durationMinutes, 10) || 60,
      },
    });

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/live-classes/:id/status
router.patch('/:id/status', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { isLive, recordingUrl } = req.body;

    const updatedClass = await prisma.liveClass.update({
      where: { id: req.params.id },
      data: {
        isLive: isLive !== undefined ? isLive : undefined,
        recordingUrl: recordingUrl !== undefined ? recordingUrl : undefined,
      },
    });

    res.json({ success: true, data: updatedClass });
  } catch (error) {
    next(error);
  }
});

export default router;
