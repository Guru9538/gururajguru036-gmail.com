export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  grade: string; // e.g., "Grade 10"
  section: string; // e.g., "A"
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  attendanceRate: number; // e.g. 94
  status: 'Active' | 'On Leave' | 'Suspended';
  avatarSeed: string;
  enrolledDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  assignedClass: string;
  qualification: string;
  avatarSeed: string;
  experienceYears: number;
}

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  classKey: string; // "10-A"
  entries: AttendanceEntry[];
}

export interface SubjectGrade {
  subject: string;
  maxScore: number;
  obtainedScore: number;
  teacherRemarks: string;
}

export interface StudentReportCard {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  section: string;
  academicYear: string;
  term: 'Term 1' | 'Mid-Term' | 'Final Term';
  subjects: SubjectGrade[];
  gpa: number;
  averagePercentage: number;
  letterGrade: string;
  classRank: number;
  totalStudents: number;
  attendancePercentage: number;
  conduct: 'Exemplary' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  principalRemarks: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  classKey: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  title: string;
  category: 'Tuition Fee' | 'Laboratory Fee' | 'Library & Tech' | 'Sports & Transport';
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  paymentMethod?: 'Credit Card' | 'Bank Transfer' | 'UPI / Digital' | 'Cash Receipt';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Urgent' | 'Events' | 'Holiday' | 'Sports';
  author: string;
  authorRole: string;
  targetAudience: 'All' | 'Students' | 'Parents' | 'Teachers';
  date: string;
  pinned: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  dueDate: string;
  totalMarks: number;
  description: string;
  submittedCount: number;
  totalCount: number;
  isSubmitted?: boolean;
}

export interface SavedLessonPlan {
  id: string;
  title: string;
  grade: string;
  subject: string;
  chapter: string;
  topic: string;
  createdAt: string;
  teacherName: string;
  objectives: string[];
  simpleExplanation: string;
  realWorldAnalogy: string;
  differentiatedStrategies: {
    foundational: string;
    intermediate: string;
    advanced: string;
  };
  classroomActivities: string[];
  homeworkSuggestion: string;
}

export interface AISettings {
  isAIEnabled: boolean;
  voiceAssistantEnabled: boolean;
  allowStudentVoice: boolean;
  selectedProvider: 'hybrid_gemini' | 'local_curriculum';
  supportKannada: boolean;
}

export interface LearningProgress {
  subject: string;
  completedLessons: number;
  totalLessons: number;
  quizScore: number;
  recommendedTopic: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
  subject: string;
}

