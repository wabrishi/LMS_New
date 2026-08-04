import { Router, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role, InvoiceStatus, PaymentMethod } from '@prisma/client';

const router = Router();

// GET /api/v1/fees
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response, next) => {
  try {
    const invoices = await prisma.feeInvoice.findMany({
      where: req.user?.instituteId ? { instituteId: req.user.instituteId } : undefined,
      include: {
        student: { include: { user: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/fees
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN), async (req: AuthRequest, res: Response, next) => {
  try {
    const { studentProfileId, amount, dueDate, description } = req.body;

    const invoice = await prisma.feeInvoice.create({
      data: {
        instituteId: req.user?.instituteId!,
        studentId: studentProfileId,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description: description || 'Tuition & Fee',
        status: InvoiceStatus.PENDING,
      },
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/fees/pay
router.post('/pay', authenticateJWT, async (req: AuthRequest, res: Response, next) => {
  try {
    const { invoiceId, amountPaid, paymentMethod, transactionId } = req.body;

    const payment = await prisma.feePayment.create({
      data: {
        invoiceId,
        amountPaid: parseFloat(amountPaid),
        paymentMethod: (paymentMethod as PaymentMethod) || PaymentMethod.RAZORPAY,
        transactionId: transactionId || `TXN-${Date.now()}`,
      },
    });

    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.PAID },
    });

    res.json({ success: true, message: 'Fee payment recorded successfully', data: payment });
  } catch (error) {
    next(error);
  }
});

export default router;
