import type {
  Student,
  Faculty,
  Course,
  Batch,
  LiveClass,
  VideoItem,
  StudyMaterial,
  Assignment,
  Quiz,
  FeeInvoice,
  Certificate,
  ForumPost,
  ChatMessage,
  NotificationItem
} from '../types';

export const mockStudents: Student[] = [
  {
    id: 'std-1',
    userId: 'u-std-1',
    rollNumber: 'ED-2026-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@student.edu',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCourseCount: 4,
    attendancePercentage: 92,
    feeStatus: 'PAID',
    admissionDate: '2026-01-15'
  },
  {
    id: 'std-2',
    userId: 'u-std-2',
    rollNumber: 'ED-2026-002',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    phone: '+91 98765 43211',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourseCount: 3,
    attendancePercentage: 88,
    feeStatus: 'PENDING',
    admissionDate: '2026-01-18'
  },
  {
    id: 'std-3',
    userId: 'u-std-3',
    rollNumber: 'ED-2026-003',
    name: 'Rohan Verma',
    email: 'rohan.verma@student.edu',
    phone: '+91 98765 43212',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    enrolledCourseCount: 5,
    attendancePercentage: 71,
    feeStatus: 'OVERDUE',
    admissionDate: '2026-01-20'
  },
  {
    id: 'std-4',
    userId: 'u-std-4',
    rollNumber: 'ED-2026-004',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@student.edu',
    phone: '+91 98765 43213',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    enrolledCourseCount: 2,
    attendancePercentage: 96,
    feeStatus: 'PAID',
    admissionDate: '2026-02-01'
  },
  {
    id: 'std-5',
    userId: 'u-std-5',
    rollNumber: 'ED-2026-005',
    name: 'Vikram Singh',
    email: 'vikram.singh@student.edu',
    phone: '+91 98765 43214',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    enrolledCourseCount: 3,
    attendancePercentage: 84,
    feeStatus: 'PAID',
    admissionDate: '2026-02-05'
  }
];

export const mockFaculty: Faculty[] = [
  {
    id: 'fac-1',
    userId: 'u-fac-1',
    employeeId: 'EMP-FAC-101',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@faculty.edu',
    phone: '+91 98111 22334',
    designation: 'Senior Professor',
    specialization: 'Full Stack Web Architecture & React',
    assignedBatchesCount: 4,
    totalStudents: 180,
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-2',
    userId: 'u-fac-2',
    employeeId: 'EMP-FAC-102',
    name: 'Prof. Meera Nair',
    email: 'meera.nair@faculty.edu',
    phone: '+91 98111 22335',
    designation: 'Associate Professor',
    specialization: 'Data Structures & Algorithms in Java',
    assignedBatchesCount: 3,
    totalStudents: 140,
    rating: 4.8,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-3',
    userId: 'u-fac-3',
    employeeId: 'EMP-FAC-103',
    name: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta@faculty.edu',
    phone: '+91 98111 22336',
    designation: 'Department Head',
    specialization: 'Cloud DevOps & Microservices Architecture',
    assignedBatchesCount: 2,
    totalStudents: 95,
    rating: 4.95,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'crs-1',
    title: 'Full-Stack Modern Web Engineering (React, Node, TypeScript)',
    category: 'Software Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    price: 499,
    durationHours: 60,
    description: 'Master full-stack development with React 19, Vite, TypeScript, Node.js, and Prisma ORM with production deployment.',
    instructorName: 'Dr. Rajesh Kumar',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    totalStudents: 245,
    rating: 4.9,
    isPublished: true,
    learningOutcomes: [
      'Build scalable single page applications with React & TypeScript',
      'Design RESTful APIs using NestJS and Prisma ORM',
      'Implement JWT RBAC authentication and OAuth flow',
      'Deploy applications with Docker and Cloudflare R2'
    ],
    prerequisites: ['Basic HTML, CSS and JavaScript knowledge'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: React 19 Foundations & State Management',
        lessons: [
          { id: 'les-1', title: 'Introduction to Modern React & JSX', contentType: 'VIDEO', duration: '24m', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'les-2', title: 'Hooks Deep Dive: useState, useEffect, useMemo', contentType: 'VIDEO', duration: '35m', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'les-3', title: 'React State Blueprint Cheat Sheet', contentType: 'PDF', duration: '10m', contentUrl: '#' }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Server API & Prisma Database Schema',
        lessons: [
          { id: 'les-4', title: 'Designing Normalized Schemas in Prisma', contentType: 'VIDEO', duration: '40m', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'les-5', title: 'Module Quiz: Database & REST APIs', contentType: 'QUIZ', duration: '20m', contentUrl: '#' }
        ]
      }
    ]
  },
  {
    id: 'crs-2',
    title: 'Advanced Data Structures & System Design in Java',
    category: 'Computer Science',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    price: 399,
    durationHours: 48,
    description: 'Comprehensive guide to solving complex LeetCode hard problems, graph algorithms, dynamic programming, and high-scale system design.',
    instructorName: 'Prof. Meera Nair',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    totalStudents: 180,
    rating: 4.8,
    isPublished: true,
    learningOutcomes: [
      'Master Graphs, Trees, Dynamic Programming, and Heap structures',
      'Architect distributed systems handling millions of requests',
      'Optimize algorithmic time complexity from O(N^2) to O(N log N)'
    ],
    prerequisites: ['Intermediate Java programming skills'],
    modules: [
      {
        id: 'mod-201',
        title: 'Module 1: Graph Traversal Algorithms',
        lessons: [
          { id: 'les-201', title: 'BFS & DFS Implementation in Java', contentType: 'VIDEO', duration: '30m', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: 'crs-3',
    title: 'Cloud DevOps Engineering, Kubernetes & AWS Architecture',
    category: 'DevOps & Cloud',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    price: 599,
    durationHours: 52,
    description: 'Automate CI/CD pipelines with GitHub Actions, provision cloud infrastructure with Terraform, and orchestrate containerized apps with Kubernetes.',
    instructorName: 'Dr. Sanjay Gupta',
    instructorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    totalStudents: 120,
    rating: 4.95,
    isPublished: true,
    learningOutcomes: [
      'Setup enterprise Kubernetes clusters on AWS EKS',
      'Build robust automated CI/CD deployment pipelines',
      'Manage Infrastructure as Code with Terraform'
    ],
    prerequisites: ['Linux terminal proficiency'],
    modules: []
  }
];

export const mockBatches: Batch[] = [
  {
    id: 'bat-1',
    courseId: 'crs-1',
    courseName: 'Full-Stack Modern Web Engineering',
    batchName: 'FS-2026-SPRING-A',
    facultyId: 'fac-1',
    facultyName: 'Dr. Rajesh Kumar',
    studentCount: 42,
    capacity: 50,
    startDate: '2026-02-01',
    endDate: '2026-05-30',
    status: 'ACTIVE'
  },
  {
    id: 'bat-2',
    courseId: 'crs-2',
    courseName: 'Advanced Data Structures & System Design',
    batchName: 'DSA-2026-SPRING-B',
    facultyId: 'fac-2',
    facultyName: 'Prof. Meera Nair',
    studentCount: 38,
    capacity: 45,
    startDate: '2026-02-10',
    endDate: '2026-06-15',
    status: 'ACTIVE'
  },
  {
    id: 'bat-3',
    courseId: 'crs-3',
    courseName: 'Cloud DevOps Engineering & Kubernetes',
    batchName: 'DEVOPS-2026-SUMMER',
    facultyId: 'fac-3',
    facultyName: 'Dr. Sanjay Gupta',
    studentCount: 28,
    capacity: 40,
    startDate: '2026-03-01',
    endDate: '2026-07-01',
    status: 'UPCOMING'
  }
];

export const mockLiveClasses: LiveClass[] = [
  {
    id: 'lc-1',
    batchId: 'bat-1',
    batchName: 'FS-2026-SPRING-A',
    title: 'Live Workshop: Building Realtime RBAC Middleware in Node.js',
    platform: 'ZOOM',
    instructorName: 'Dr. Rajesh Kumar',
    meetingLink: 'https://zoom.us/j/9876543210',
    scheduledTime: 'Today at 04:00 PM',
    durationMins: 90,
    status: 'LIVE',
    attendeesCount: 38
  },
  {
    id: 'lc-2',
    batchId: 'bat-2',
    batchName: 'DSA-2026-SPRING-B',
    title: 'Dijkstra & Shortest Path Algorithm Masterclass',
    platform: 'GOOGLE_MEET',
    instructorName: 'Prof. Meera Nair',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    scheduledTime: 'Tomorrow at 10:00 AM',
    durationMins: 60,
    status: 'UPCOMING',
    attendeesCount: 0
  },
  {
    id: 'lc-3',
    batchId: 'bat-3',
    batchName: 'DEVOPS-2026-SUMMER',
    title: 'Terraform State Management & AWS S3 Backend Configuration',
    platform: 'MS_TEAMS',
    instructorName: 'Dr. Sanjay Gupta',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/12345',
    scheduledTime: 'Aug 05, 2026 at 02:00 PM',
    durationMins: 75,
    status: 'UPCOMING',
    attendeesCount: 0
  }
];

export const mockVideos: VideoItem[] = [
  {
    id: 'vid-1',
    title: '1.1 Architecture Overview & Modern React 19 Paradigms',
    courseId: 'crs-1',
    courseName: 'Full-Stack Modern Web Engineering',
    duration: '24m 15s',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    views: 340,
    progressPercent: 100,
    isBookmarked: true
  },
  {
    id: 'vid-2',
    title: '1.2 Advanced State Management with Context & Custom Hooks',
    courseId: 'crs-1',
    courseName: 'Full-Stack Modern Web Engineering',
    duration: '35m 40s',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
    views: 290,
    progressPercent: 65,
    isBookmarked: false
  },
  {
    id: 'vid-3',
    title: '2.1 Prisma ORM Integration & PostgreSQL Connection Pooling',
    courseId: 'crs-1',
    courseName: 'Full-Stack Modern Web Engineering',
    duration: '42m 10s',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format&fit=crop&q=80',
    views: 180,
    progressPercent: 10,
    isBookmarked: true
  }
];

export const mockMaterials: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Fullstack_LMS_Architecture_Blueprint.pdf',
    courseName: 'Full-Stack Modern Web Engineering',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    fileUrl: '#',
    uploadedAt: '2026-02-02',
    folder: 'Architecture & Diagrams'
  },
  {
    id: 'mat-2',
    title: 'DSA_Graph_Algorithms_CheatSheet.pdf',
    courseName: 'Advanced Data Structures & System Design',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    fileUrl: '#',
    uploadedAt: '2026-02-12',
    folder: 'Lecture Slides'
  },
  {
    id: 'mat-3',
    title: 'Docker_Kubernetes_Config_Samples.zip',
    courseName: 'Cloud DevOps Engineering & Kubernetes',
    fileType: 'ZIP',
    fileSize: '18.4 MB',
    fileUrl: '#',
    uploadedAt: '2026-03-02',
    folder: 'Lab Code'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    batchName: 'FS-2026-SPRING-A',
    courseName: 'Full-Stack Modern Web Engineering',
    title: 'Assignment 1: Build a Scalable RBAC Dashboard Component',
    description: 'Implement a reusable React component with TypeScript interfaces, clean light mode styling, and dynamic permissions check.',
    maxMarks: 100,
    dueDate: '2026-08-10',
    submittedCount: 35,
    totalStudents: 42,
    studentSubmission: {
      submittedAt: '2026-08-02 14:30',
      fileUrl: 'https://github.com/student/rbac-submission.zip',
      score: 95,
      feedback: 'Excellent clean code structure and thorough type definitions!',
      status: 'GRADED'
    }
  },
  {
    id: 'asg-2',
    batchName: 'DSA-2026-SPRING-B',
    courseName: 'Advanced Data Structures & System Design',
    title: 'Assignment 2: Implement LRU Cache & O(1) Operations',
    description: 'Construct a Least Recently Used (LRU) Cache data structure using Doubly Linked List and HashMap in Java.',
    maxMarks: 50,
    dueDate: '2026-08-15',
    submittedCount: 18,
    totalStudents: 38
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'qz-1',
    courseName: 'Full-Stack Modern Web Engineering',
    title: 'Mid-Term Exam: React 19, TypeScript & REST API Design',
    durationMinutes: 30,
    totalMarks: 30,
    passingMarks: 18,
    isNegativeMarking: true,
    questionCount: 3,
    status: 'PUBLISHED',
    questions: [
      {
        id: 'q-1',
        type: 'MCQ',
        text: 'Which hook in React 19 is specifically designed for handling async action transitions and pendings?',
        options: ['useAsyncEffect', 'useActionState', 'useTransition', 'useServerAction'],
        correctAnswer: 'useActionState',
        marks: 10
      },
      {
        id: 'q-2',
        type: 'TRUE_FALSE',
        text: 'In TypeScript, type aliases can be extended using the `extends` keyword just like interface declarations.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        marks: 10
      },
      {
        id: 'q-3',
        type: 'MCQ',
        text: 'What HTTP status code is returned when a client presents invalid JWT credentials?',
        options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
        correctAnswer: '401 Unauthorized',
        marks: 10
      }
    ]
  }
];

export const mockFeeInvoices: FeeInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-001',
    studentName: 'Aarav Sharma',
    studentRoll: 'ED-2026-001',
    courseName: 'Full-Stack Modern Web Engineering',
    amount: 499,
    paidAmount: 499,
    dueDate: '2026-02-01',
    status: 'PAID',
    paymentHistory: [
      { transactionId: 'TXN-982138912', date: '2026-01-28', amount: 499, method: 'Stripe Credit Card' }
    ]
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-002',
    studentName: 'Priya Patel',
    studentRoll: 'ED-2026-002',
    courseName: 'Advanced Data Structures',
    amount: 399,
    paidAmount: 0,
    dueDate: '2026-08-15',
    status: 'PENDING',
    paymentHistory: []
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-003',
    studentName: 'Rohan Verma',
    studentRoll: 'ED-2026-003',
    courseName: 'Full-Stack Modern Web Engineering',
    amount: 499,
    paidAmount: 200,
    dueDate: '2026-07-01',
    status: 'OVERDUE',
    paymentHistory: [
      { transactionId: 'TXN-773129031', date: '2026-06-25', amount: 200, method: 'Razorpay UPI' }
    ]
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'CERT-2026-FS-9012',
    studentName: 'Aarav Sharma',
    courseName: 'Full-Stack Modern Web Engineering (React, Node, TypeScript)',
    issueDate: '2026-07-30',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VERIFIED-CERT-2026-FS-9012',
    pdfUrl: '#',
    grade: 'A+ (Distinction)'
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    authorName: 'Aarav Sharma',
    authorRole: 'STUDENT',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'How to properly optimize Prisma query response time for nested batch relations?',
    content: 'Hi everyone! When fetching batch enrollments alongside student profiles and attendance records, I noticed the query takes around 450ms. What are the best composite indexing strategies in PostgreSQL for Prisma?',
    tags: ['Prisma', 'PostgreSQL', 'Performance'],
    upvotes: 14,
    replyCount: 2,
    isPinned: true,
    createdAt: '2 hours ago',
    replies: [
      {
        id: 'rep-1',
        authorName: 'Dr. Rajesh Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        content: 'Great question Aarav! You should add a composite index `@@index([batchId, studentId])` on `batch_enrollments` table and use `select` instead of `include` to fetch only required scalar fields.',
        createdAt: '1 hour ago'
      }
    ]
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'fac-1',
    senderName: 'Dr. Rajesh Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    receiverId: 'std-1',
    content: 'Hello Aarav, your solution for Assignment 1 was outstanding! Keep up the great work.',
    timestamp: '10:45 AM'
  },
  {
    id: 'msg-2',
    senderId: 'std-1',
    senderName: 'Aarav Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    receiverId: 'fac-1',
    content: 'Thank you Professor! I will see you in today live class at 4 PM.',
    timestamp: '10:48 AM'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Live Class Starting Soon',
    message: 'Full-Stack RBAC Middleware live session starts in 15 minutes.',
    time: '10 min ago',
    type: 'INFO',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Assignment Graded',
    message: 'Dr. Rajesh Kumar awarded 95/100 for Assignment 1.',
    time: '1 hour ago',
    type: 'SUCCESS',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Fee Payment Reminder',
    message: 'Installment for Advanced Data Structures is pending.',
    time: '1 day ago',
    type: 'WARNING',
    isRead: true
  }
];
