import { Router, Request, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/certificates
router.get('/', authenticateJWT, async (_req: AuthRequest, res: Response, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        student: { include: { user: true } },
        course: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    res.json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/certificates/verify/:certificateNumber (Public Verification)
router.get('/verify/:certificateNumber', async (req: Request, res: Response, next) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber: req.params.certificateNumber },
      include: {
        student: { include: { user: true } },
        course: true,
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid certificate number or record not found.',
      });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        certificateNumber: cert.certificateNumber,
        issuedAt: cert.issuedAt,
        studentName: `${cert.student.user.firstName} ${cert.student.user.lastName}`,
        courseTitle: cert.course.title,
        qrCodeUrl: cert.qrCodeUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/certificates
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN), async (req: AuthRequest, res: Response, next) => {
  try {
    const { studentProfileId, courseId } = req.body;
    const certificateNumber = `CERT-GTIE-${Date.now().toString().slice(-6)}`;

    const cert = await prisma.certificate.create({
      data: {
        studentId: studentProfileId,
        courseId,
        certificateNumber,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${certificateNumber}`,
        pdfUrl: `https://example.com/certificates/${certificateNumber}.pdf`,
      },
      include: { student: { include: { user: true } }, course: true },
    });

    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
});

export default router;
