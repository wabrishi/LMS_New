import { PrismaClient, Role, UserStatus, LiveClassPlatform, ContentType, QuestionType, AttendanceStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting PRODUCTION Database Initial Seeding for Hostinger MySQL...');

  // 1. Clear existing data in production DB if any
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

  console.log('🧹 Cleaned existing production records.');

  // 2. Production Institute
  const institute = await prisma.institute.create({
    data: {
      name: 'Apex Academy of Technology',
      code: 'APEX-PROD-2026',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
      domain: 'apex-academy.edu',
      status: UserStatus.ACTIVE,
    },
  });

  // 3. Separate Production Passwords & Hashes (NOT using development credentials)
  const adminPasswordHash = await bcrypt.hash('ProdAdminSecure#2026!', 10);
  const facultyPasswordHash = await bcrypt.hash('FacultyProdSecure#2026!', 10);
  const studentPasswordHash = await bcrypt.hash('StudentProdSecure#2026!', 10);

  // 4. Create Production Accounts
  const prodAdmin = await prisma.user.create({
    data: {
      instituteId: institute.id,
      email: 'sysadmin@yourdomain.com',
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1 (800) 555-0199',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: UserStatus.ACTIVE,
    },
  });

  const prodFaculty = await prisma.user.create({
    data: {
      instituteId: institute.id,
      email: 'head.faculty@yourdomain.com',
      passwordHash: facultyPasswordHash,
      role: Role.FACULTY,
      firstName: 'Prof. Marcus',
      lastName: 'Vance',
      phone: '+1 (800) 555-0210',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: UserStatus.ACTIVE,
    },
  });

  const prodStudent = await prisma.user.create({
    data: {
      instituteId: institute.id,
      email: 'student.demo@yourdomain.com',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      firstName: 'Sophia',
      lastName: 'Chen',
      phone: '+1 (800) 555-0344',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: UserStatus.ACTIVE,
    },
  });

  // Profiles
  const facultyProfile = await prisma.facultyProfile.create({
    data: {
      userId: prodFaculty.id,
      employeeId: 'PROD-EMP-001',
      qualification: 'Ph.D. in Computer Science',
      designation: 'Department Head & Lead Instructor',
      specialization: 'Software Architecture & Cloud Databases',
    },
  });

  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: prodStudent.id,
      rollNumber: 'PROD-STU-1001',
      parentName: 'David Chen',
      parentContact: '+1 (800) 555-9988',
      guardianDetail: 'Primary Contact',
    },
  });

  // 5. Initial Production Course & Curriculum
  const course = await prisma.course.create({
    data: {
      instituteId: institute.id,
      instructorId: prodFaculty.id,
      title: 'Production Enterprise Web Engineering',
      category: 'Computer Science',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      price: 599.00,
      durationHours: 100,
      description: 'Comprehensive production course covering microservices, MySQL databases, TypeScript, and cloud deployment.',
      isPublished: true,
    },
  });

  const module1 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Module 1: Production MySQL Architecture',
      orderIndex: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Connecting Express to Hostinger MySQL Database',
      contentType: ContentType.VIDEO,
      contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      durationMins: 45,
      orderIndex: 1,
    },
  });

  // 6. Production Batch & Enrollment
  const batch = await prisma.batch.create({
    data: {
      instituteId: institute.id,
      courseId: course.id,
      facultyId: facultyProfile.id,
      name: 'Production Cohort 2026',
      capacity: 100,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-09-01'),
      status: 'ACTIVE',
    },
  });

  await prisma.batchEnrollment.create({
    data: {
      batchId: batch.id,
      studentId: studentProfile.id,
      completionStatus: 'IN_PROGRESS',
    },
  });

  console.log('✅ PRODUCTION Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Production Super Admin: sysadmin@yourdomain.com | Password: ProdAdminSecure#2026!');
  console.log('Production Faculty:     head.faculty@yourdomain.com | Password: FacultyProdSecure#2026!');
  console.log('Production Student:     student.demo@yourdomain.com | Password: StudentProdSecure#2026!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Production Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
