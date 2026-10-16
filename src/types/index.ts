export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  role?: 'student' | 'admin';
  grade: string;
  section: string;
  avatar: string;
  dob?: string;
  phone?: string;
  address?: string;
  parentName: string;
  parentEmail: string;
  parentWhatsApp: string;
  bloodGroup?: string;
  totalFees: number;
  paidFees: number;
  dueFees: number;
  feePlan?: string;
  feeType?: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  score: number;
  remarks: string;
}

export interface ClassSchedule {
  _id: string;
  subject: string;
  topic: string;
  teacher: string;
  room: string;
  grade: string;
  startTime: string;
  endTime: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  meetingUrl?: string;
  date: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex?: number;
  marks: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  dueDate: string;
  questionCount?: number;
  questions?: Question[];
}

export interface TestResult {
  _id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  whatsappStatus: 'sent' | 'failed' | 'queued';
  emailStatus: 'sent' | 'failed' | 'queued';
  feedback?: string;
  submittedAt: string;
}

export interface SyllabusSubtopic {
  category: string;
  items: string[];
}

export interface SyllabusModule {
  no: number;
  name: string;
  type: 'Code' | 'No-code' | 'Project';
  duration: string;
  hours: number;
  subtopics: SyllabusSubtopic[];
  miniProjects?: string[];
}

export interface SyllabusUnit {
  unitNumber: string;
  title: string;
  weightage: string;
  topics: string[];
}

export interface SyllabusItem {
  id: string;
  subject: string;
  code: string;
  term: string;
  totalCredits: number;
  totalChapters: number;
  downloadRestricted: boolean;
  phaseNumber?: number;
  phaseTitle?: string;
  months?: string;
  focus?: string;
  hours?: number;
  outcome?: string;
  phaseProjects?: string[];
  nextPhase?: string;
  modules?: SyllabusModule[];
  units: SyllabusUnit[];
}

export interface VideoLecture {
  _id: string;
  title: string;
  subject: string;
  teacher: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  date: string;
  description: string;
}

export interface CourseMaterial {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  teacher: string;
  summary: string;
  content: string;
  tags: string[];
  views: number;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  totalMarks: number;
  isSubmitted: boolean;
  submission?: {
    submittedAt: string;
    content: string;
    grade?: string;
    marksObtained?: number;
    teacherRemarks?: string;
    status: string;
  };
}

export interface PaymentItem {
  _id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  feeType: string;
  status: string;
  receiptNumber: string;
  date: string;
}
