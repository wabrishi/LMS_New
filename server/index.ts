import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import studentRoutes from './routes/student.routes';
import facultyRoutes from './routes/faculty.routes';
import courseRoutes from './routes/course.routes';
import batchRoutes from './routes/batch.routes';
import liveClassRoutes from './routes/liveClass.routes';
import assignmentRoutes from './routes/assignment.routes';
import quizRoutes from './routes/quiz.routes';
import feeRoutes from './routes/fee.routes';
import certificateRoutes from './routes/certificate.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Register API Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/batches', batchRoutes);
app.use('/api/v1/live-classes', liveClassRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/certificates', certificateRoutes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    name: 'Online Learning Management System (LMS) API Server',
    version: '1.0.0',
    database: 'MySQL (Prisma ORM)',
    status: 'Running',
    documentation: '/docs/api-specification.json',
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Express REST API server running at http://localhost:${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/v1/health`);
  });
});

export default app;
