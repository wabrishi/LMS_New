// server/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path2 from "path";
import fs2 from "fs";

// server/config/db.ts
import { PrismaClient } from "@prisma/client";
function sanitizeDatabaseUrl(url) {
  if (!url || url.includes("YOUR_HOSTINGER_DB_PASSWORD")) {
    return "mysql://root:password@localhost:3306/online_class";
  }
  const trimmed = url.trim();
  if (!trimmed.startsWith("mysql://")) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    const username = decodeURIComponent(parsed.username || "");
    let password = decodeURIComponent(parsed.password || "");
    const host = parsed.hostname || "localhost";
    const port = parsed.port || "3306";
    const database = decodeURIComponent(parsed.pathname ? parsed.pathname.replace(/^\//, "") : "");
    if (password.startsWith("/")) {
      password = password.slice(1);
    }
    const encodedPassword = encodeURIComponent(password);
    return `mysql://${username}:${encodedPassword}@${host}:${port}/${database}`;
  } catch {
    const match = trimmed.match(/^mysql:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+)$/);
    if (match) {
      const username = decodeURIComponent(match[1]);
      let password = decodeURIComponent(match[2]);
      if (password.startsWith("/")) {
        password = password.slice(1);
      }
      const host = match[3];
      const port = match[4] || "3306";
      const database = match[5].split("?")[0];
      const encodedPassword = encodeURIComponent(password);
      return `mysql://${username}:${encodedPassword}@${host}:${port}/${database}`;
    }
  }
  return trimmed;
}
var dbUrl = process.env.DATABASE_URL;
var prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  },
  log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"]
});
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("\u2705 MySQL Database connected successfully via Prisma Client");
    return true;
  } catch (error) {
    console.warn("\u26A0\uFE0F Database Connection Warning:", error?.message || error);
    return false;
  }
}

// server/middleware/errorHandler.ts
function errorHandler(err, _req, res, _next) {
  console.error("\u{1F4A5} Unhandled API Server Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
}

// server/routes/auth.routes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired authentication token." });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ success: false, message: "Authorization token required." });
  }
}
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions for this action."
      });
    }
    next();
  };
}

// server/routes/auth.routes.ts
var router = Router();
var JWT_SECRET2 = process.env.JWT_SECRET || "edupulse_super_secret_jwt_key_2026";
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        institute: true,
        studentProfile: true,
        facultyProfile: true
      }
    });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      instituteId: user.instituteId
    };
    const token = jwt2.sign(payload, JWT_SECRET2, { expiresIn: "24h" });
    res.json({
      success: true,
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        institute: user.institute,
        studentProfile: user.studentProfile,
        facultyProfile: user.facultyProfile
      }
    });
  } catch (error) {
    next(error);
  }
});
router.get("/me", authenticateJWT, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: {
        institute: true,
        studentProfile: true,
        facultyProfile: true
      }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        institute: user.institute,
        studentProfile: user.studentProfile,
        facultyProfile: user.facultyProfile
      }
    });
  } catch (error) {
    next(error);
  }
});
var auth_routes_default = router;

// server/routes/health.routes.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get("/", async (_req, res) => {
  try {
    const dbResult = await prisma.$queryRaw`SELECT 1 as alive`;
    res.json({
      success: true,
      status: "UP",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      database: "MySQL connected",
      dbQuery: dbResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "DOWN",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      database: "MySQL connection failed",
      error: error.message
    });
  }
});
var health_routes_default = router2;

// server/routes/student.routes.ts
import { Router as Router3 } from "express";
import bcrypt2 from "bcryptjs";
import { Role } from "@prisma/client";
var router3 = Router3();
router3.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const { page = "1", limit = "10", search, status } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const whereClause = {
      role: Role.STUDENT
    };
    if (req.user?.instituteId) {
      whereClause.instituteId = req.user.instituteId;
    }
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
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
                include: { batch: { include: { course: true } } }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.user.count({ where: whereClause })
    ]);
    res.json({
      success: true,
      data: students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
});
router3.post("/", authenticateJWT, authorizeRoles(Role.SUPER_ADMIN, Role.INSTITUTE_ADMIN), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, rollNumber, parentName, parentContact } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email address already registered." });
    }
    const passwordHash = await bcrypt2.hash(password || "Student@123", 10);
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
            parentContact
          }
        }
      },
      include: {
        studentProfile: true
      }
    });
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    next(error);
  }
});
router3.get("/:id", authenticateJWT, async (req, res, next) => {
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
            certificates: true
          }
        }
      }
    });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found." });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});
var student_routes_default = router3;

// server/routes/faculty.routes.ts
import { Router as Router4 } from "express";
import bcrypt3 from "bcryptjs";
import { Role as Role2 } from "@prisma/client";
var router4 = Router4();
router4.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const faculty = await prisma.user.findMany({
      where: {
        role: Role2.FACULTY,
        instituteId: req.user?.instituteId
      },
      include: {
        facultyProfile: {
          include: {
            assignedBatches: { include: { course: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: faculty });
  } catch (error) {
    next(error);
  }
});
router4.post("/", authenticateJWT, authorizeRoles(Role2.SUPER_ADMIN, Role2.INSTITUTE_ADMIN), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, employeeId, qualification, designation, specialization } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email address already in use." });
    }
    const passwordHash = await bcrypt3.hash(password || "Faculty@123", 10);
    const instituteId = req.user?.instituteId || req.body.instituteId;
    const newFaculty = await prisma.user.create({
      data: {
        instituteId,
        email,
        passwordHash,
        role: Role2.FACULTY,
        firstName,
        lastName,
        phone,
        facultyProfile: {
          create: {
            employeeId: employeeId || `EMP-FAC-${Date.now().toString().slice(-4)}`,
            qualification: qualification || "Master Degree",
            designation: designation || "Assistant Professor",
            specialization: specialization || "General Computer Science"
          }
        }
      },
      include: { facultyProfile: true }
    });
    res.status(201).json({ success: true, data: newFaculty });
  } catch (error) {
    next(error);
  }
});
var faculty_routes_default = router4;

// server/routes/course.routes.ts
import { Router as Router5 } from "express";
import { Role as Role3 } from "@prisma/client";
var router5 = Router5();
router5.get("/", async (_req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true }
        },
        modules: {
          include: { lessons: true },
          orderBy: { orderIndex: "asc" }
        },
        _count: { select: { batches: true, quizzes: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
});
router5.post("/", authenticateJWT, authorizeRoles(Role3.SUPER_ADMIN, Role3.INSTITUTE_ADMIN, Role3.FACULTY), async (req, res, next) => {
  try {
    const { title, category, price, durationHours, description, thumbnailUrl } = req.body;
    const course = await prisma.course.create({
      data: {
        instituteId: req.user?.instituteId,
        instructorId: req.user?.id,
        title,
        category,
        price: parseFloat(price) || 0,
        durationHours: parseInt(durationHours, 10) || 0,
        description: description || "",
        thumbnailUrl: thumbnailUrl || null,
        isPublished: true
      }
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});
router5.get("/:id", async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: true,
        modules: {
          include: { lessons: true },
          orderBy: { orderIndex: "asc" }
        },
        quizzes: true
      }
    });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});
var course_routes_default = router5;

// server/routes/batch.routes.ts
import { Router as Router6 } from "express";
import { Role as Role4 } from "@prisma/client";
var router6 = Router6();
router6.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const batches = await prisma.batch.findMany({
      where: req.user?.instituteId ? { instituteId: req.user.instituteId } : void 0,
      include: {
        course: true,
        faculty: { include: { user: true } },
        enrollments: { include: { student: { include: { user: true } } } },
        liveClasses: true,
        assignments: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: batches });
  } catch (error) {
    next(error);
  }
});
router6.post("/", authenticateJWT, authorizeRoles(Role4.SUPER_ADMIN, Role4.INSTITUTE_ADMIN, Role4.FACULTY), async (req, res, next) => {
  try {
    const { courseId, facultyId, name, capacity, startDate, endDate } = req.body;
    const batch = await prisma.batch.create({
      data: {
        instituteId: req.user?.instituteId,
        courseId,
        facultyId: facultyId || null,
        name,
        capacity: parseInt(capacity, 10) || 50,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      include: { course: true, faculty: true }
    });
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
});
router6.post("/:batchId/enroll", authenticateJWT, authorizeRoles(Role4.SUPER_ADMIN, Role4.INSTITUTE_ADMIN), async (req, res, next) => {
  try {
    const { studentProfileId } = req.body;
    const enrollment = await prisma.batchEnrollment.create({
      data: {
        batchId: req.params.batchId,
        studentId: studentProfileId
      },
      include: { batch: true, student: true }
    });
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
});
var batch_routes_default = router6;

// server/routes/liveClass.routes.ts
import { Router as Router7 } from "express";
import { Role as Role5 } from "@prisma/client";
var router7 = Router7();
router7.get("/", authenticateJWT, async (_req, res, next) => {
  try {
    const liveClasses = await prisma.liveClass.findMany({
      include: {
        batch: {
          include: {
            course: true,
            faculty: { include: { user: true } }
          }
        }
      },
      orderBy: { scheduledAt: "asc" }
    });
    res.json({ success: true, data: liveClasses });
  } catch (error) {
    next(error);
  }
});
router7.post("/", authenticateJWT, authorizeRoles(Role5.SUPER_ADMIN, Role5.INSTITUTE_ADMIN, Role5.FACULTY), async (req, res, next) => {
  try {
    const { batchId, title, platform, meetingLink, meetingId, passcode, scheduledAt, durationMinutes } = req.body;
    const newClass = await prisma.liveClass.create({
      data: {
        batchId,
        title,
        platform: platform || "ZOOM",
        meetingLink,
        meetingId,
        passcode,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: parseInt(durationMinutes, 10) || 60
      }
    });
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
});
router7.patch("/:id/status", authenticateJWT, authorizeRoles(Role5.SUPER_ADMIN, Role5.INSTITUTE_ADMIN, Role5.FACULTY), async (req, res, next) => {
  try {
    const { isLive, recordingUrl } = req.body;
    const updatedClass = await prisma.liveClass.update({
      where: { id: req.params.id },
      data: {
        isLive: isLive !== void 0 ? isLive : void 0,
        recordingUrl: recordingUrl !== void 0 ? recordingUrl : void 0
      }
    });
    res.json({ success: true, data: updatedClass });
  } catch (error) {
    next(error);
  }
});
var liveClass_routes_default = router7;

// server/routes/assignment.routes.ts
import { Router as Router8 } from "express";
import { Role as Role6 } from "@prisma/client";
var router8 = Router8();
router8.get("/", authenticateJWT, async (_req, res, next) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        batch: { include: { course: true } },
        submissions: { include: { student: { include: { user: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
});
router8.post("/", authenticateJWT, authorizeRoles(Role6.SUPER_ADMIN, Role6.INSTITUTE_ADMIN, Role6.FACULTY), async (req, res, next) => {
  try {
    const { batchId, title, description, maxMarks, dueDate, attachmentUrl } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        batchId,
        title,
        description,
        maxMarks: parseInt(maxMarks, 10) || 100,
        dueDate: new Date(dueDate),
        attachmentUrl
      }
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
});
router8.post("/:id/submit", authenticateJWT, authorizeRoles(Role6.STUDENT), async (req, res, next) => {
  try {
    const { fileUrl } = req.body;
    const studentUser = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { studentProfile: true }
    });
    if (!studentUser?.studentProfile) {
      return res.status(400).json({ success: false, message: "Student profile not found." });
    }
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: req.params.id,
          studentId: studentUser.studentProfile.id
        }
      },
      update: {
        fileUrl,
        submittedAt: /* @__PURE__ */ new Date()
      },
      create: {
        assignmentId: req.params.id,
        studentId: studentUser.studentProfile.id,
        fileUrl
      }
    });
    res.json({ success: true, message: "Assignment submitted successfully", data: submission });
  } catch (error) {
    next(error);
  }
});
router8.post("/submissions/:submissionId/grade", authenticateJWT, authorizeRoles(Role6.SUPER_ADMIN, Role6.FACULTY), async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const graded = await prisma.assignmentSubmission.update({
      where: { id: req.params.submissionId },
      data: {
        marks: parseFloat(marks),
        feedback,
        gradedAt: /* @__PURE__ */ new Date()
      }
    });
    res.json({ success: true, message: "Submission graded successfully", data: graded });
  } catch (error) {
    next(error);
  }
});
var assignment_routes_default = router8;

// server/routes/quiz.routes.ts
import { Router as Router9 } from "express";
import { Role as Role7 } from "@prisma/client";
var router9 = Router9();
router9.get("/", authenticateJWT, async (_req, res, next) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        course: true,
        questions: { orderBy: { orderIndex: "asc" } },
        attempts: { include: { student: { include: { user: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
});
router9.post("/", authenticateJWT, authorizeRoles(Role7.SUPER_ADMIN, Role7.INSTITUTE_ADMIN, Role7.FACULTY), async (req, res, next) => {
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
          create: questions.map((q, idx) => ({
            questionText: q.questionText,
            type: q.type || "MCQ",
            optionsJson: JSON.stringify(q.options || []),
            correctAnswer: q.correctAnswer,
            marks: q.marks || 10,
            orderIndex: idx + 1
          }))
        } : void 0
      },
      include: { questions: true }
    });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
});
router9.post("/:id/submit", authenticateJWT, authorizeRoles(Role7.STUDENT), async (req, res, next) => {
  try {
    const { answers } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { studentProfile: true }
    });
    if (!user?.studentProfile) {
      return res.status(400).json({ success: false, message: "Student profile not found." });
    }
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true }
    });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
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
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    res.json({
      success: true,
      message: "Quiz attempt evaluated",
      data: {
        attemptId: attempt.id,
        score: calculatedScore,
        totalMarks: quiz.totalMarks,
        passed: isPassed
      }
    });
  } catch (error) {
    next(error);
  }
});
var quiz_routes_default = router9;

// server/routes/fee.routes.ts
import { Router as Router10 } from "express";
import { Role as Role8, InvoiceStatus, PaymentMethod } from "@prisma/client";
var router10 = Router10();
router10.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const invoices = await prisma.feeInvoice.findMany({
      where: req.user?.instituteId ? { instituteId: req.user.instituteId } : void 0,
      include: {
        student: { include: { user: true } },
        payments: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
});
router10.post("/", authenticateJWT, authorizeRoles(Role8.SUPER_ADMIN, Role8.INSTITUTE_ADMIN), async (req, res, next) => {
  try {
    const { studentProfileId, amount, dueDate, description } = req.body;
    const invoice = await prisma.feeInvoice.create({
      data: {
        instituteId: req.user?.instituteId,
        studentId: studentProfileId,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description: description || "Tuition & Fee",
        status: InvoiceStatus.PENDING
      }
    });
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
});
router10.post("/pay", authenticateJWT, async (req, res, next) => {
  try {
    const { invoiceId, amountPaid, paymentMethod, transactionId } = req.body;
    const payment = await prisma.feePayment.create({
      data: {
        invoiceId,
        amountPaid: parseFloat(amountPaid),
        paymentMethod: paymentMethod || PaymentMethod.RAZORPAY,
        transactionId: transactionId || `TXN-${Date.now()}`
      }
    });
    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.PAID }
    });
    res.json({ success: true, message: "Fee payment recorded successfully", data: payment });
  } catch (error) {
    next(error);
  }
});
var fee_routes_default = router10;

// server/routes/certificate.routes.ts
import { Router as Router11 } from "express";
import { Role as Role9 } from "@prisma/client";
var router11 = Router11();
router11.get("/", authenticateJWT, async (_req, res, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        student: { include: { user: true } },
        course: true
      },
      orderBy: { issuedAt: "desc" }
    });
    res.json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
});
router11.get("/verify/:certificateNumber", async (req, res, next) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber: req.params.certificateNumber },
      include: {
        student: { include: { user: true } },
        course: true
      }
    });
    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid certificate number or record not found."
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
        qrCodeUrl: cert.qrCodeUrl
      }
    });
  } catch (error) {
    next(error);
  }
});
router11.post("/", authenticateJWT, authorizeRoles(Role9.SUPER_ADMIN, Role9.INSTITUTE_ADMIN), async (req, res, next) => {
  try {
    const { studentProfileId, courseId } = req.body;
    const certificateNumber = `CERT-GTIE-${Date.now().toString().slice(-6)}`;
    const cert = await prisma.certificate.create({
      data: {
        studentId: studentProfileId,
        courseId,
        certificateNumber,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${certificateNumber}`,
        pdfUrl: `https://example.com/certificates/${certificateNumber}.pdf`
      },
      include: { student: { include: { user: true } }, course: true }
    });
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
});
var certificate_routes_default = router11;

// server/routes/dbSetup.routes.ts
import { Router as Router12 } from "express";
import { PrismaClient as PrismaClient2 } from "@prisma/client";
import fs from "fs";
import path from "path";
var router12 = Router12();
router12.get("/current", (_req, res) => {
  const dbUrl2 = process.env.DATABASE_URL || "";
  let host = "localhost";
  let port = "3306";
  let database = "";
  let username = "";
  let password = "";
  if (dbUrl2.startsWith("mysql://")) {
    try {
      const parsed = new URL(dbUrl2);
      username = decodeURIComponent(parsed.username || "");
      password = decodeURIComponent(parsed.password || "");
      host = parsed.hostname || "localhost";
      port = parsed.port || "3306";
      database = decodeURIComponent(parsed.pathname ? parsed.pathname.replace(/^\//, "") : "");
    } catch {
      const match = dbUrl2.match(/^mysql:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+)$/);
      if (match) {
        username = decodeURIComponent(match[1]);
        password = decodeURIComponent(match[2]);
        host = match[3];
        port = match[4] || "3306";
        database = match[5].split("?")[0];
      }
    }
    if (password.startsWith("/")) {
      password = password.slice(1);
    }
  }
  res.json({
    success: true,
    data: {
      host,
      port,
      database,
      username,
      password,
      rawUrl: dbUrl2
    }
  });
});
router12.post("/test", async (req, res) => {
  const { host = "localhost", port = "3306", database, username, password } = req.body;
  if (!database || !username) {
    return res.status(400).json({
      success: false,
      message: "Database Name and Username are required."
    });
  }
  const rawPassword = (password || "").replace(/^\//, "");
  const encodedPassword = encodeURIComponent(rawPassword);
  const candidateUrl = `mysql://${username}:${encodedPassword}@${host}:${port}/${database}`;
  let testClient = null;
  try {
    testClient = new PrismaClient2({
      datasources: {
        db: { url: candidateUrl }
      },
      log: ["error"]
    });
    await testClient.$connect();
    await testClient.$queryRaw`SELECT 1 as result`;
    await testClient.$disconnect();
    return res.json({
      success: true,
      message: "\u2705 Database Connection Successful! Credentials are 100% valid.",
      candidateUrl
    });
  } catch (error) {
    if (testClient) {
      try {
        await testClient.$disconnect();
      } catch {
      }
    }
    let detailedReason = error?.message || "Unknown database connection error";
    if (detailedReason.includes("Authentication failed")) {
      detailedReason = `Authentication failed: Invalid username '${username}' or password for MySQL database '${database}'.`;
    } else if (detailedReason.includes("Unknown database")) {
      detailedReason = `Database '${database}' does not exist on MySQL server at ${host}:${port}. Please create the database first in phpMyAdmin/hPanel.`;
    } else if (detailedReason.includes("Can't connect") || detailedReason.includes("ECONNREFUSED")) {
      detailedReason = `Could not reach MySQL server at ${host}:${port}. Check host address (try 127.0.0.1 or localhost) and port.`;
    }
    return res.status(400).json({
      success: false,
      message: "\u274C Database Connection Failed",
      error: detailedReason
    });
  }
});
router12.post("/save", async (req, res) => {
  const { databaseUrl } = req.body;
  if (!databaseUrl || !databaseUrl.startsWith("mysql://")) {
    return res.status(400).json({
      success: false,
      message: "Invalid MySQL database URL format."
    });
  }
  try {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }
    if (envContent.includes("DATABASE_URL=")) {
      envContent = envContent.replace(/DATABASE_URL=.*$/m, `DATABASE_URL="${databaseUrl}"`);
    } else {
      envContent += `
DATABASE_URL="${databaseUrl}"
`;
    }
    fs.writeFileSync(envPath, envContent, "utf8");
    process.env.DATABASE_URL = databaseUrl;
    return res.json({
      success: true,
      message: "\u{1F389} Database URL saved to .env file successfully! Database is now active."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to write to .env file.",
      error: error?.message || String(error)
    });
  }
});
var dbSetup_routes_default = router12;

// server/index.ts
dotenv.config();
var app = express();
var PORT = process.env.PORT || 5e3;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/health", health_routes_default);
app.use("/api/v1/db-setup", dbSetup_routes_default);
app.use("/api/v1/auth", auth_routes_default);
app.use("/api/v1/students", student_routes_default);
app.use("/api/v1/faculty", faculty_routes_default);
app.use("/api/v1/courses", course_routes_default);
app.use("/api/v1/batches", batch_routes_default);
app.use("/api/v1/live-classes", liveClass_routes_default);
app.use("/api/v1/assignments", assignment_routes_default);
app.use("/api/v1/quizzes", quiz_routes_default);
app.use("/api/v1/fees", fee_routes_default);
app.use("/api/v1/certificates", certificate_routes_default);
var distPath = path2.join(process.cwd(), "dist");
if (fs2.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path2.join(distPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      name: "Online Learning Management System (LMS) API Server",
      version: "1.0.0",
      database: "MySQL (Prisma ORM)",
      status: "Running"
    });
  });
}
app.use(errorHandler);
var isPassenger = typeof global.PhusionPassenger !== "undefined";
var listenTarget = isPassenger ? "passenger" : PORT;
app.listen(listenTarget, () => {
  console.log(`\u{1F680} Express REST API server running on ${listenTarget}`);
  connectDB();
});
var index_default = app;
export {
  index_default as default
};
