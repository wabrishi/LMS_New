import { PrismaClient, Role, UserStatus, LiveClassPlatform, ContentType, QuestionType, AttendanceStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise LMS Database Seeding for MySQL...');

  // 1. Clear existing data in reverse order of dependencies
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.batchEnrollment.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institute.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 2. Create Institute
  const institute = await prisma.institute.create({
    data: {
      name: 'Global Tech Institute of Engineering',
      code: 'GTIE-2026',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
      domain: 'institute.edu',
      status: UserStatus.ACTIVE,
    },
  });

  console.log(`🏫 Created Institute: ${institute.name} (${institute.code})`);

  // Password hash for all demo users: SuperSecurePass123!
  const passwordHash = await bcrypt.hash('SuperSecurePass123!', 10);

  // 3. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      instituteId: institute.id,
      email: 'admin@institute.edu',
      passwordHash,
      role: Role.SUPER_ADMIN,
      firstName: 'Alexander',
      lastName: 'Vance',
      phone: '+1 (555) 019-2831',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: UserStatus.ACTIVE,
    },
  });

  const facultyUser1 = await prisma.user.create({
    data: {
      instituteId: institute.id,
      email: 'faculty@institute.edu',
      passwordHash,
      role: Role.FACULTY,
      firstName: 'Dr. Sarah',
      lastName: 'Jenkins',
      phone: '+1 (555) 392-1029',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: UserStatus.ACTIVE,
    },
  });

  const studentUser1 = await prisma.user.create({
    data: {
      instituteId: institute.id,
      email: 'student@institute.edu',
      passwordHash,
      role: Role.STUDENT,
      firstName: 'Liam',
      lastName: 'Reynolds',
      phone: '+1 (555) 839-2011',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: UserStatus.ACTIVE,
    },
  });

  // 4. Create Profiles
  const facultyProfile1 = await prisma.facultyProfile.create({
    data: {
      userId: facultyUser1.id,
      employeeId: 'EMP-FAC-001',
      qualification: 'Ph.D. in Computer Science',
      designation: 'Senior Professor & Department Chair',
      specialization: 'Full Stack Web Architecture & Cloud Systems',
    },
  });

  const studentProfile1 = await prisma.studentProfile.create({
    data: {
      userId: studentUser1.id,
      rollNumber: 'STU-2026-0042',
      parentName: 'Robert Reynolds',
      parentContact: '+1 (555) 991-0022',
      guardianDetail: 'Primary Emergency Contact',
    },
  });

  console.log('👤 Created Super Admin, Faculty, and Student accounts.');

  // 5. Create Courses & Curriculum
  const course1 = await prisma.course.create({
    data: {
      instituteId: institute.id,
      instructorId: facultyUser1.id,
      title: 'Full Stack Web Development Mastery',
      category: 'Computer Science & Software Engineering',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      price: 499.00,
      durationHours: 120,
      description: 'Master modern frontend & backend web development using React, Node.js, Express, TypeScript, and MySQL Database.',
      isPublished: true,
    },
  });

  const module1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: Advanced Frontend Architecture',
      orderIndex: 1,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module1.id,
        title: 'Introduction to Modern React & State Management',
        contentType: ContentType.VIDEO,
        contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        durationMins: 45,
        orderIndex: 1,
      },
      {
        moduleId: module1.id,
        title: 'TypeScript Design Patterns Guide (PDF)',
        contentType: ContentType.PDF,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        durationMins: 30,
        orderIndex: 2,
      },
    ],
  });

  console.log('📚 Created Courses, Modules, and Lessons.');

  // 6. Create Batch & Enrollment
  const batch1 = await prisma.batch.create({
    data: {
      instituteId: institute.id,
      courseId: course1.id,
      facultyId: facultyProfile1.id,
      name: 'FSWD Spring 2026 - Cohort A',
      capacity: 60,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-07-30'),
      status: 'ACTIVE',
    },
  });

  await prisma.batchEnrollment.create({
    data: {
      batchId: batch1.id,
      studentId: studentProfile1.id,
      completionStatus: 'IN_PROGRESS',
    },
  });

  console.log(`🏷️ Created Batch: ${batch1.name}`);

  // 7. Live Classes
  const liveClass1 = await prisma.liveClass.create({
    data: {
      batchId: batch1.id,
      title: 'Live Workshop: Designing Production Databases with MySQL & Prisma',
      platform: LiveClassPlatform.ZOOM,
      meetingLink: 'https://zoom.us/j/9876543210',
      meetingId: '987 654 3210',
      passcode: '2026LMS',
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      durationMinutes: 90,
      isLive: false,
    },
  });

  console.log(`🎥 Created Live Class schedule: ${liveClass1.title}`);

  // 8. Assignments & Submissions
  const assignment1 = await prisma.assignment.create({
    data: {
      batchId: batch1.id,
      title: 'Assignment 1: MySQL Schema Design & Normalization',
      description: 'Design a 3NF relational database schema for an e-commerce platform using MySQL workbench or Prisma.',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 7 * 86400000),
      attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  });

  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: studentProfile1.id,
      fileUrl: 'https://example.com/submissions/liam_reynolds_assign1.pdf',
      marks: 95.0,
      feedback: 'Excellent normalization structure and clean indexing strategy!',
      gradedAt: new Date(),
    },
  });

  // 9. Quizzes & Questions
  const quiz1 = await prisma.quiz.create({
    data: {
      courseId: course1.id,
      title: 'Database Architecture & SQL Proficiency Test',
      durationMinutes: 45,
      totalMarks: 100,
      passingMarks: 50,
      isNegativeMarking: false,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'Which SQL keyword is used to ensure unique constraint on a table column?',
      type: QuestionType.MCQ,
      optionsJson: JSON.stringify(['UNIQUE', 'DISTINCT', 'PRIMARY KEY', 'CHECK']),
      correctAnswer: 'UNIQUE',
      marks: 10.0,
      orderIndex: 1,
    },
  });

  await prisma.quizAttempt.create({
    data: {
      quizId: quiz1.id,
      studentId: studentProfile1.id,
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(),
      score: 90.0,
      passed: true,
    },
  });

  // 10. Attendance Records
  await prisma.attendanceRecord.create({
    data: {
      batchId: batch1.id,
      studentId: studentProfile1.id,
      date: new Date(),
      status: AttendanceStatus.PRESENT,
      remarks: 'Attended full session',
    },
  });

  // 11. Fee Invoices & Payments
  const invoice1 = await prisma.feeInvoice.create({
    data: {
      instituteId: institute.id,
      studentId: studentProfile1.id,
      invoiceNumber: 'INV-2026-0091',
      amount: 499.00,
      dueDate: new Date(Date.now() + 15 * 86400000),
      status: InvoiceStatus.PAID,
      description: 'Tuition Fee - Full Stack Web Development Mastery',
    },
  });

  await prisma.feePayment.create({
    data: {
      invoiceId: invoice1.id,
      amountPaid: 499.00,
      paymentMethod: PaymentMethod.RAZORPAY,
      transactionId: 'TXN-RZP-98127391',
      paidAt: new Date(),
    },
  });

  // 12. Certificates
  await prisma.certificate.create({
    data: {
      studentId: studentProfile1.id,
      courseId: course1.id,
      certificateNumber: 'CERT-GTIE-2026-8812',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CERT-GTIE-2026-8812',
      pdfUrl: 'https://example.com/certificates/CERT-GTIE-2026-8812.pdf',
    },
  });

  // 13. Forum Posts & Direct Messages
  const forumPost = await prisma.forumPost.create({
    data: {
      authorId: studentUser1.id,
      title: 'Best practices for MySQL Connection Pooling in Node.js?',
      content: 'What is the recommended pool connection limit when deploying Express.js apps with MySQL on AWS RDS?',
      tags: 'mysql,express,node,prisma',
      upvotes: 14,
    },
  });

  await prisma.forumReply.create({
    data: {
      postId: forumPost.id,
      authorId: facultyUser1.id,
      content: 'A standard rule of thumb is setting pool size based on CPU cores: (CPU cores * 2) + disk count. Prisma manages connection pool automatically via DATABASE_URL query parameters!',
      upvotes: 8,
    },
  });

  console.log('✅ Enterprise LMS Database Seeding Completed Successfully for MySQL!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
