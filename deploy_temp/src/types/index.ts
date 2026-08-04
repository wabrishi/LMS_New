export type UserRole = 'SUPER_ADMIN' | 'INSTITUTE_ADMIN' | 'FACULTY' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  instituteId: string;
  instituteName: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  enrolledCourseCount: number;
  attendancePercentage: number;
  feeStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  admissionDate: string;
}

export interface Faculty {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  specialization: string;
  assignedBatchesCount: number;
  totalStudents: number;
  rating: number;
  avatarUrl: string;
}

export interface Lesson {
  id: string;
  title: string;
  contentType: 'VIDEO' | 'PDF' | 'QUIZ' | 'ASSIGNMENT';
  duration: string;
  contentUrl: string;
  isCompleted?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  durationHours: number;
  description: string;
  instructorName: string;
  instructorAvatar: string;
  totalStudents: number;
  rating: number;
  isPublished: boolean;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
}

export interface Batch {
  id: string;
  courseId: string;
  courseName: string;
  batchName: string;
  facultyId: string;
  facultyName: string;
  studentCount: number;
  capacity: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface LiveClass {
  id: string;
  batchId: string;
  batchName: string;
  title: string;
  platform: 'ZOOM' | 'MEET' | 'TEAMS' | 'JITSI' | 'GOOGLE_MEET' | 'MS_TEAMS';
  instructorName: string;
  meetingLink: string;
  scheduledTime: string;
  durationMins: number;
  status: 'UPCOMING' | 'LIVE' | 'ENDED';
  attendeesCount: number;
}

export interface VideoItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
  progressPercent: number;
  isBookmarked: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  courseName: string;
  fileType: 'PDF' | 'DOCX' | 'PPT' | 'ZIP' | 'IMAGE';
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  folder: string;
}

export interface Assignment {
  id: string;
  batchName: string;
  courseName: string;
  title: string;
  description: string;
  maxMarks: number;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  studentSubmission?: {
    submittedAt: string;
    fileUrl: string;
    score?: number;
    feedback?: string;
    status: 'SUBMITTED' | 'GRADED' | 'PENDING';
  };
}

export interface Question {
  id: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY' | 'CODING';
  text: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
}

export interface Quiz {
  id: string;
  courseName: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  isNegativeMarking: boolean;
  questionCount: number;
  questions: Question[];
  status: 'DRAFT' | 'PUBLISHED';
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  rollNumber: string;
  avatarUrl: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentName: string;
  studentRoll: string;
  courseName: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentHistory: {
    transactionId: string;
    date: string;
    amount: number;
    method: string;
  }[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  qrCodeUrl: string;
  pdfUrl: string;
  grade: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: string;
  replies: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
}
