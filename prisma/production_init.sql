-- ====================================================================
-- Production MySQL Database Initialization Dump File
-- Database: online_class_db / Hostinger MySQL Database
-- Designed for: Hostinger cPanel / phpMyAdmin / MySQL 8.0+
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Institutes Table
CREATE TABLE IF NOT EXISTS `institutes` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `logoUrl` VARCHAR(191) NULL,
  `domain` VARCHAR(191) NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `institutes_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `instituteId` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'FACULTY', 'STUDENT') NOT NULL,
  `firstName` VARCHAR(191) NOT NULL,
  `lastName` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `avatarUrl` VARCHAR(191) NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key` (`email`),
  INDEX `users_instituteId_idx` (`instituteId`),
  INDEX `users_role_idx` (`role`),
  CONSTRAINT `users_instituteId_fkey` FOREIGN KEY (`instituteId`) REFERENCES `institutes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Student Profiles Table
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `rollNumber` VARCHAR(191) NOT NULL,
  `admissionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `parentName` VARCHAR(191) NULL,
  `parentContact` VARCHAR(191) NULL,
  `guardianDetail` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `student_profiles_userId_key` (`userId`),
  UNIQUE INDEX `student_profiles_rollNumber_key` (`rollNumber`),
  CONSTRAINT `student_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Faculty Profiles Table
CREATE TABLE IF NOT EXISTS `faculty_profiles` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `employeeId` VARCHAR(191) NOT NULL,
  `qualification` VARCHAR(191) NOT NULL,
  `designation` VARCHAR(191) NOT NULL,
  `specialization` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `faculty_profiles_userId_key` (`userId`),
  UNIQUE INDEX `faculty_profiles_employeeId_key` (`employeeId`),
  CONSTRAINT `faculty_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(191) NOT NULL,
  `instituteId` VARCHAR(191) NOT NULL,
  `instructorId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `thumbnailUrl` VARCHAR(191) NULL,
  `price` DOUBLE NOT NULL DEFAULT 0.0,
  `durationHours` INT NOT NULL DEFAULT 0,
  `description` TEXT NOT NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `courses_instituteId_idx` (`instituteId`),
  CONSTRAINT `courses_instituteId_fkey` FOREIGN KEY (`instituteId`) REFERENCES `institutes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `courses_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Course Modules Table
CREATE TABLE IF NOT EXISTS `course_modules` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `orderIndex` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `course_modules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Lessons Table
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` VARCHAR(191) NOT NULL,
  `moduleId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `contentType` ENUM('VIDEO', 'PDF', 'DOCX', 'PPT', 'ZIP', 'LINK') NOT NULL,
  `contentUrl` VARCHAR(191) NOT NULL,
  `durationMins` INT NOT NULL DEFAULT 0,
  `orderIndex` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `lessons_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `course_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Batches Table
CREATE TABLE IF NOT EXISTS `batches` (
  `id` VARCHAR(191) NOT NULL,
  `instituteId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `facultyId` VARCHAR(191) NULL,
  `name` VARCHAR(191) NOT NULL,
  `capacity` INT NOT NULL DEFAULT 50,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `batches_instituteId_fkey` FOREIGN KEY (`instituteId`) REFERENCES `institutes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `batches_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `batches_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculty_profiles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Batch Enrollments Table
CREATE TABLE IF NOT EXISTS `batch_enrollments` (
  `id` VARCHAR(191) NOT NULL,
  `batchId` VARCHAR(191) NOT NULL,
  `studentId` VARCHAR(191) NOT NULL,
  `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completionStatus` VARCHAR(191) NOT NULL DEFAULT 'IN_PROGRESS',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `batch_enrollments_batchId_studentId_key` (`batchId`, `studentId`),
  CONSTRAINT `batch_enrollments_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `batches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `batch_enrollments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Live Classes Table
CREATE TABLE IF NOT EXISTS `live_classes` (
  `id` VARCHAR(191) NOT NULL,
  `batchId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `platform` ENUM('ZOOM', 'GOOGLE_MEET', 'MS_TEAMS', 'JITSI') NOT NULL DEFAULT 'ZOOM',
  `meetingLink` VARCHAR(191) NOT NULL,
  `meetingId` VARCHAR(191) NULL,
  `passcode` VARCHAR(191) NULL,
  `scheduledAt` DATETIME(3) NOT NULL,
  `durationMinutes` INT NOT NULL DEFAULT 60,
  `recordingUrl` VARCHAR(191) NULL,
  `isLive` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `live_classes_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `batches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- INSERT PRODUCTION SEED DATA (Distinct Production User Credentials)
-- ====================================================================

-- 1. Insert Production Institute
INSERT INTO `institutes` (`id`, `name`, `code`, `logoUrl`, `domain`, `status`, `createdAt`, `updatedAt`) VALUES
('inst-prod-001', 'Apex Academy of Technology', 'APEX-PROD-2026', 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80', 'apex-academy.edu', 'ACTIVE', NOW(), NOW());

-- 2. Insert Production Users
-- Password for sysadmin@yourdomain.com: ProdAdminSecure#2026!
-- Password for head.faculty@yourdomain.com: FacultyProdSecure#2026!
-- Password for student.demo@yourdomain.com: StudentProdSecure#2026!
INSERT INTO `users` (`id`, `instituteId`, `email`, `passwordHash`, `role`, `firstName`, `lastName`, `phone`, `avatarUrl`, `status`, `createdAt`, `updatedAt`) VALUES
('u-prod-admin', 'inst-prod-001', 'sysadmin@yourdomain.com', '$2a$10$tMHXKfwefhziKc1lVMa82O95Axil5raEr2x./vDRidnRQVkPTGV5u', 'SUPER_ADMIN', 'System', 'Administrator', '+1 (800) 555-0199', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'ACTIVE', NOW(), NOW()),
('u-prod-fac', 'inst-prod-001', 'head.faculty@yourdomain.com', '$2a$10$2HAkjEeCvzQjq.FTDDWPRO7iwnIBVXsT3n6eyYHnwTq4suEtgTRB6', 'FACULTY', 'Prof. Marcus', 'Vance', '+1 (800) 555-0210', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'ACTIVE', NOW(), NOW()),
('u-prod-stu', 'inst-prod-001', 'student.demo@yourdomain.com', '$2a$10$N/YgL6AQJ2UCxI.EepKsSePqIiSC1LryItOcvZM1ZccdD0q5zM6g.', 'STUDENT', 'Sophia', 'Chen', '+1 (800) 555-0344', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', 'ACTIVE', NOW(), NOW());

-- 3. Insert Profiles
INSERT INTO `faculty_profiles` (`id`, `userId`, `employeeId`, `qualification`, `designation`, `specialization`) VALUES
('fac-prof-001', 'u-prod-fac', 'PROD-EMP-001', 'Ph.D. in Computer Science', 'Department Head & Lead Instructor', 'Software Architecture & Cloud Databases');

INSERT INTO `student_profiles` (`id`, `userId`, `rollNumber`, `admissionDate`, `parentName`, `parentContact`, `guardianDetail`) VALUES
('stu-prof-001', 'u-prod-stu', 'PROD-STU-1001', NOW(), 'David Chen', '+1 (800) 555-9988', 'Primary Contact');

-- 4. Insert Initial Production Course
INSERT INTO `courses` (`id`, `instituteId`, `instructorId`, `title`, `category`, `thumbnailUrl`, `price`, `durationHours`, `description`, `isPublished`, `createdAt`, `updatedAt`) VALUES
('crs-prod-001', 'inst-prod-001', 'u-prod-fac', 'Production Enterprise Web Engineering', 'Computer Science', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 599.00, 100, 'Comprehensive production course covering microservices, MySQL databases, TypeScript, and cloud deployment.', 1, NOW(), NOW());

-- 5. Insert Course Module & Lesson
INSERT INTO `course_modules` (`id`, `courseId`, `title`, `orderIndex`, `createdAt`) VALUES
('mod-prod-001', 'crs-prod-001', 'Module 1: Production MySQL Architecture', 1, NOW());

INSERT INTO `lessons` (`id`, `moduleId`, `title`, `contentType`, `contentUrl`, `durationMins`, `orderIndex`) VALUES
('lsn-prod-001', 'mod-prod-001', 'Connecting Express to Hostinger MySQL Database', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 45, 1);

-- 6. Insert Batch & Enrollment
INSERT INTO `batches` (`id`, `instituteId`, `courseId`, `facultyId`, `name`, `capacity`, `startDate`, `endDate`, `status`, `createdAt`) VALUES
('btch-prod-001', 'inst-prod-001', 'crs-prod-001', 'fac-prof-001', 'Production Cohort 2026', 100, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH), 'ACTIVE', NOW());

INSERT INTO `batch_enrollments` (`id`, `batchId`, `studentId`, `enrolledAt`, `completionStatus`) VALUES
('enr-prod-001', 'btch-prod-001', 'stu-prof-001', NOW(), 'IN_PROGRESS');

SET FOREIGN_KEY_CHECKS = 1;
