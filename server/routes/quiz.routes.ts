import { Router, Response } from 'express';
import { prisma } from '../config/db';
import { authenticateJWT, AuthRequest, authorizeRoles } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// GET /api/v1/quizzes
router.get('/', authenticateJWT, async (_req: AuthRequest, res: Response, next) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        course: true,
        questions: { orderBy: { orderIndex: 'asc' } },
        attempts: { include: { student: { include: { user: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quizzes
router.post('/', authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN, Role.FACULTY), async (req: AuthRequest, res: Response, next) => {
  try {
    const { courseId, title, durationMinutes, totalMarks, passingMarks, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        title,
        durationMinutes: parseInt(durationMinutes, 10) || 30,
        totalMarks: parseInt(totalMarks, 10) || 100,
        passingMarks: parseInt(passingMarks, 10) || 40,
        questions: questions && Array.isArray(questions) ? {
          create: questions.map((q: any, idx: number) => ({
            questionText: q.questionText,
            type: q.type || 'MCQ',
            optionsJson: JSON.stringify(q.options || []),
            correctAnswer: q.correctAnswer,
            marks: q.marks || 10.0,
            orderIndex: idx + 1,
          })),
        } : undefined,
      },
      include: { questions: true },
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quizzes/:id/submit
router.post('/:id/submit', authenticateJWT, authorizeRoles(Role.STUDENT), async (req: AuthRequest, res: Response, next) => {
  try {
    const { answers } = req.body; // Map of questionId -> studentAnswer

    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { studentProfile: true },
    });

    if (!user?.studentProfile) {
      return res.status(400).json({ success: false, message: 'Student profile not found.' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    let calculatedScore = 0;
    quiz.questions.forEach((q) => {
      const studentAns = answers ? answers[q.id] : null;
      if (studentAns && studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        calculatedScore += q.marks;
      }
    });

    const isPassed = calculatedScore >= quiz.passingMarks;

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        studentId: user.studentProfile.id,
        score: calculatedScore,
        passed: isPassed,
        completedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Quiz attempt evaluated',
      data: {
        attemptId: attempt.id,
        score: calculatedScore,
        totalMarks: quiz.totalMarks,
        passed: isPassed,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
