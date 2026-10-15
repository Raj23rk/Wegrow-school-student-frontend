import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';
import {
  Users,
  CalendarCheck,
  FileText,
  ClipboardList,
  Video,
  BookOpen,
  MessageCircle,
  CreditCard,
  Plus,
  Send,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  Sparkles,
  Bell,
  Mail,
  Trash2,
  X,
  UserPlus,
  Phone,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'students'
  | 'attendance'
  | 'quizzes'
  | 'assignments'
  | 'videos'
  | 'notes'
  | 'finance'
  | 'whatsapp'
  | 'templates';

export const ADMIN_STUDENTS: any[] = [];

export const SEED_DATA = {
  assignments: [] as any[],
  videos: [] as any[],
  courseMaterials: [] as any[],
};

interface AdminControlCenterProps {
  onNotificationSent?: (payload: any) => void;
  activeSubTab?: AdminTab;
  onSelectSubTab?: (tab: AdminTab) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  onNotificationSent,
  activeSubTab = 'overview',
  onSelectSubTab,
}) => {
  const { toast, confirmModal } = useToast();
  const [currentTab, setCurrentTab] = useState<AdminTab>(activeSubTab);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<any>(null);

  // Sync tab with external prop if provided
  useEffect(() => {
    if (activeSubTab) setCurrentTab(activeSubTab);
  }, [activeSubTab]);

  const switchTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    if (onSelectSubTab) onSelectSubTab(tab);
  };

  // State for Batch Attendance
  const [selectedBatch, setSelectedBatch] = useState('Cohort Alpha (12-Month Diploma)');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSuccessMsg, setAttendanceSuccessMsg] = useState('');

  // State for Assignment Upload
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState('Machine Learning');
  const [asgBatch, setAsgBatch] = useState('Cohort Alpha (12-Month Diploma)');
  const [asgDueDate, setAsgDueDate] = useState('2026-10-25');
  const [asgMarks, setAsgMarks] = useState(50);
  const [asgDesc, setAsgDesc] = useState('');
  const [asgSuccessMsg, setAsgSuccessMsg] = useState('');

  // State for Video Lecture Upload
  const [vidTitle, setVidTitle] = useState('');
  const [vidSubject, setVidSubject] = useState('Deep Learning & CV');
  const [vidDuration, setVidDuration] = useState('45 mins');
  const [vidUrl, setVidUrl] = useState('');
  const [vidTeacher, setVidTeacher] = useState('Prof. Vikram Rao');
  const [vidSuccessMsg, setVidSuccessMsg] = useState('');

  // State for Daily Notes Upload
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Generative AI & LLMs');
  const [noteTeacher, setNoteTeacher] = useState('Prof. Ananya Sen');
  const [noteSummary, setNoteSummary] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSuccessMsg, setNoteSuccessMsg] = useState('');

  // State for WhatsApp Message Sender
  const [waTargetBatch, setWaTargetBatch] = useState('Cohort Alpha (12-Month Diploma)');
  const [waMessageType, setWaMessageType] = useState('absence');
  const [waCustomMessage, setWaCustomMessage] = useState('');
  const [waSending, setWaSending] = useState(false);
  const [waSuccessMsg, setWaSuccessMsg] = useState('');

  // State for Finance & Payment Invoice
  const [payStudentId, setPayStudentId] = useState('std_001');
  const [payAmount, setPayAmount] = useState(15000);
  const [payMethod, setPayMethod] = useState('UPI');
  const [payFeeType, setPayFeeType] = useState('Term 2 Lab & Tuition Fee');
  const [payRefNo, setPayRefNo] = useState('');
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Students & Payments List
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [quizzesList, setQuizzesList] = useState<any[]>([]);
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [videosList, setVideosList] = useState<any[]>([]);
  const [materialsList, setMaterialsList] = useState<any[]>([]);

  // State for Quiz Assessment Upload
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('Machine Learning');
  const [quizDuration, setQuizDuration] = useState(15);
  const [quizPassingMarks, setQuizPassingMarks] = useState(10);
  const [quizDesc, setQuizDesc] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    {
      id: 'q1',
      questionText: 'What is the primary function of self-attention in Transformer architectures?',
      options: [
        'Weights the relative importance of tokens across an entire sequence concurrently',
        'Reduces image channels using 2D max pooling kernels',
        'Caches static HTML files on CDN edge servers',
        'Estimates manual parameter gradients using finite differences',
      ],
      correctOptionIndex: 0,
      marks: 5,
      explanation: 'Self-attention maps tokens into query, key, and value vectors to capture contextual dependencies.',
    },
    {
      id: 'q2',
      questionText: 'Which loss function is recommended for multi-class classification?',
      options: [
        'Categorical Cross-Entropy',
        'Mean Squared Error',
        'Huber Loss',
        'Cosine Similarity Loss',
      ],
      correctOptionIndex: 0,
      marks: 5,
      explanation: 'Categorical cross-entropy evaluates the probability distribution outputted by the softmax layer.',
    },
  ]);
  const [quizSuccessMsg, setQuizSuccessMsg] = useState('');
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Search & Filter for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [showPasswordIds, setShowPasswordIds] = useState<Record<string, boolean>>({});
  const [copiedRollId, setCopiedRollId] = useState<string | null>(null);

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: 'WG26-001',
    password: 'WG26-001@2026',
    className: 'AI & GenAI Master Track',
    schoolName: '',
    batch: 'Cohort Alpha (12-Month Diploma)',
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    email: '',
    totalFees: 45000,
    paidFees: 0,
  });
  const [studentCreating, setStudentCreating] = useState(false);
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');

  // Quick Direct Parent Notification Modal (WhatsApp / Email)
  const [notifyingStudent, setNotifyingStudent] = useState<any | null>(null);
  const [notifyChannel, setNotifyChannel] = useState<'both' | 'whatsapp' | 'email'>('both');
  const [notifySubject, setNotifySubject] = useState('WeGrow Official Notice');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifySending, setNotifySending] = useState(false);
  const [notifySuccessMsg, setNotifySuccessMsg] = useState('');
  const [directNotifyTemplateId, setDirectNotifyTemplateId] = useState('');

  // Notification Templates & Bulk Broadcast
  const [templatesList, setTemplatesList] = useState<any[]>([
    {
      id: 'tmpl_credentials',
      title: 'Student Portal Login Credentials (Username & Password)',
      category: 'Credentials',
      channel: 'both',
      subject: 'Student Portal Login Credentials - {studentName} | WeGrow Campus',
      templateBody: '🎓 WeGrow Skill Campus - Student Portal Login Credentials\n\nDear {fatherName} & {studentName},\n\nWelcome to WeGrow Skill Campus! Your Student Learning Portal account has been activated.\n\n🔑 Login Credentials:\n• Student Name: {studentName}\n• Username / Roll No: {username}\n• Password: {password}\n• Email: {email}\n• Batch / Course: {className}\n\n🌐 Portal Login Link:\nhttps://school.wegrowbschool.in/#login\n\n💡 Quick Steps:\n1. Click the portal link above\n2. Enter Username ({username}) & Password ({password})\n3. Access interactive AI labs, daily notes, video lectures, and live attendance.\n\nPlease keep your credentials safe.',
    },
    {
      id: 'tmpl_fee_receipt',
      title: 'Fee Payment Receipt & Login Access',
      category: 'Fees',
      channel: 'both',
      subject: 'Fee Payment Receipt: {studentName} | WeGrow Skill Campus',
      templateBody: '💳 WeGrow Skill Campus - Fee Payment Receipt\n\nDear {fatherName},\n\nWe acknowledge receipt of fee payment for {studentName} ({rollNumber}).\n\n💰 Fee Summary:\n• Course: {className}\n• Total Course Fee: INR ₹{totalFees}\n• Amount Paid: INR ₹{paidFees}\n• Pending Balance Due: INR ₹{dueFees}\n\n🔑 Student Portal Login:\n• Username: {username}\n• Password: {password}\n• Portal URL: https://school.wegrowbschool.in/#login\n\nThank you for choosing WeGrow Skill Campus.',
    },
    {
      id: 'tmpl_01',
      title: 'Daily Attendance Absence Alert',
      category: 'Attendance',
      channel: 'both',
      subject: 'Urgent: Student Attendance Alert - WeGrow Sivakasi Campus',
      templateBody: 'Dear {fatherName} & {motherName},\n\nThis is an official notice that your ward {studentName} ({className}) from {schoolName} was marked ABSENT today ({date}) without prior approved leave.\n\nPlease verify with campus administration.',
    },
    {
      id: 'tmpl_02',
      title: 'Tuition Fee Due & Razorpay Settlement Link',
      category: 'Fees',
      channel: 'both',
      subject: 'Tuition Fee Settlement Reminder - WeGrow Skill Campus',
      templateBody: 'Dear {fatherName},\n\nGentle reminder: The academic term fee for {studentName} ({className}) has a pending balance of INR ₹{dueFees}.\n\nPlease complete online settlement via Razorpay UPI in the Student Portal.',
    },
    {
      id: 'tmpl_03',
      title: 'Academic Achievement & Diagnostic Test Release',
      category: 'Academic',
      channel: 'both',
      subject: 'Academic Milestone: Diagnostic Evaluation Scores Released',
      templateBody: 'Dear Parents, We are pleased to inform you that recent hands-on AI & Robotics evaluation results for {studentName} ({className}) are now published. Full scorecard & instructor feedback are accessible on portal.',
    },
    {
      id: 'tmpl_04',
      title: 'Parent-Teacher Meeting (PTM) Invitation',
      category: 'PTM',
      channel: 'both',
      subject: 'PTM Scheduled at WeGrow Campus',
      templateBody: 'Dear {fatherName} & {motherName}, WeGrow Campus cordially invites you to the upcoming Parent-Teacher Conference this Saturday at 10:30 AM to discuss {studentName}\'s academic development.',
    },
    {
      id: 'tmpl_05',
      title: 'Campus Holiday Announcement',
      category: 'Notice',
      channel: 'both',
      subject: 'Campus Holiday Announcement | WeGrow Skill Campus',
      templateBody: 'Attention Parents of {studentName}: WeGrow Campus will remain closed on {date} on account of Institutional Festival. Online coding labs remain open 24/7.',
    },
  ]);

  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: 'Attendance',
    channel: 'both',
    subject: '',
    templateBody: '',
  });
  const [templateCreating, setTemplateCreating] = useState(false);

  // Bulk Broadcast State
  const [bulkTargetBatch, setBulkTargetBatch] = useState('All Batches');
  const [bulkChannel, setBulkChannel] = useState<'both' | 'whatsapp' | 'email'>('both');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [bulkCustomSubject, setBulkCustomSubject] = useState('Official Notice from WeGrow Skill Campus');
  const [bulkCustomMessage, setBulkCustomMessage] = useState(
    'Dear {fatherName} & {motherName}, please note the latest institutional update regarding {studentName} of {className} ({schoolName}).'
  );
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');
  const [bulkBroadcastHistory, setBulkBroadcastHistory] = useState<any[]>([]);

  useEffect(() => {
    loadOverview();
    loadStudents();
    loadAttendance();
    loadPayments();
    loadTemplates();
    loadQuizzes();
    loadAssignments();
    loadVideos();
    loadMaterials();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await api.getQuizzes();
      if (res && Array.isArray(res.data)) setQuizzesList(res.data);
    } catch {}
  };

  const loadAssignments = async () => {
    try {
      const res = await api.getAssignments();
      if (res && Array.isArray(res.data)) setAssignmentsList(res.data);
    } catch {}
  };

  const loadVideos = async () => {
    try {
      const res = await api.getVideos();
      if (res && Array.isArray(res.data)) setVideosList(res.data);
    } catch {}
  };

  const loadMaterials = async () => {
    try {
      const res = await api.getMaterials();
      if (res && Array.isArray(res.data)) setMaterialsList(res.data);
    } catch {}
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizSuccessMsg('');
    if (!quizTitle.trim()) {
      toast.warning('Quiz title is required', 'Validation Error');
      return;
    }
    try {
      setQuizSubmitting(true);
      const res = await api.createQuiz({
        title: quizTitle,
        subject: quizSubject,
        durationMinutes: Number(quizDuration) || 15,
        passingMarks: Number(quizPassingMarks) || 10,
        description: quizDesc || `Evaluative diagnostic assessment on ${quizSubject}`,
        questions: quizQuestions,
      });
      const msg = res.message || 'Quiz assessment task published successfully!';
      setQuizSuccessMsg(msg);
      toast.success(msg, 'Quiz Published');
      setQuizTitle('');
      setQuizDesc('');
      loadQuizzes();
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish quiz', 'Publish Failed');
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleDeleteQuiz = (id: string) => {
    confirmModal({
      title: 'Delete Quiz Assessment',
      message: 'Are you sure you want to delete this quiz? This action cannot be undone.',
      confirmText: 'Delete Quiz',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.deleteQuiz(id);
          toast.success('Quiz assessment deleted successfully', 'Quiz Deleted');
          loadQuizzes();
        } catch (err: any) {
          toast.error(err.message || 'Failed to delete quiz', 'Delete Failed');
        }
      },
    });
  };

  const handleDeleteAssignment = (id: string) => {
    confirmModal({
      title: 'Delete Assignment',
      message: 'Are you sure you want to delete this assignment? Students will no longer see it.',
      confirmText: 'Delete Assignment',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.deleteAssignment(id);
          toast.success('Assignment deleted successfully', 'Assignment Deleted');
          loadAssignments();
        } catch (err: any) {
          toast.error(err.message || 'Failed to delete assignment', 'Delete Failed');
        }
      },
    });
  };

  const loadOverview = async () => {
    try {
      const res = await api.getAdminOverview();
      if (res.success) setOverview(res.data);
    } catch (err) {
      console.warn('Overview fallback');
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.getAdminStudents();
      if (res.success && Array.isArray(res.data)) {
        setStudentsList(res.data);
      }
    } catch (err) {
      console.warn('Students fallback');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyStudentCredentials = (student: any) => {
    const roll = student.rollNumber || 'WG26-001';
    const pwd = student.password || `${roll}@2026`;
    const credText = `WeGrow Student Portal Credentials:\nStudent: ${student.name || 'Student'}\nUsername: ${roll}\nPassword: ${pwd}\nLogin URL: ${window.location.origin}/#login`;
    navigator.clipboard.writeText(credText);
    const key = student.id || student._id || roll;
    setCopiedRollId(key);
    toast.success(`Copied login credentials for ${student.name || roll}!`, 'Credentials Copied');
    setTimeout(() => setCopiedRollId(null), 2500);
  };

  const handleOpenNewStudentModal = async () => {
    try {
      const res = await api.getNextEnrollmentNumber();
      if (res.success && res.nextRollNumber) {
        setNewStudent((prev) => ({
          ...prev,
          rollNumber: res.nextRollNumber,
          password: res.defaultPassword || `${res.nextRollNumber}@2026`,
          paidFees: 0,
        }));
      }
    } catch (err) {
      const existing = studentsList
        .map((s) => s.rollNumber?.match(/WG26-(\d+)/i))
        .filter(Boolean)
        .map((m: any) => parseInt(m[1], 10));
      const max = existing.length > 0 ? Math.max(...existing) : 0;
      const next = `WG26-${String(max + 1).padStart(3, '0')}`;
      setNewStudent((prev) => ({
        ...prev,
        rollNumber: next,
        password: `${next}@2026`,
        paidFees: 0,
      }));
    }
    setIsNewStudentModalOpen(true);
  };

  const handleResetRoster = () => {
    confirmModal({
      title: 'Clear Student Roster',
      message: 'Are you sure you want to clear the student roster? Next enrollment will start with WG26-001.',
      confirmText: 'Clear Roster',
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await api.resetStudents();
          setStudentsList([]);
          setNewStudent((prev) => ({
            ...prev,
            rollNumber: res.nextRollNumber || 'WG26-001',
            password: res.defaultPassword || 'WG26-001@2026',
          }));
          loadOverview();
          toast.success('Student roster reset! Next enrollment will start with WG26-001.', 'Roster Cleared');
        } catch (err: any) {
          setStudentsList([]);
          toast.info('Roster cleared locally.', 'Roster Cleared');
        }
      },
    });
  };

  const handleLoadSampleCohort = async () => {
    try {
      const res = await api.loadSampleStudents();
      loadStudents();
      loadOverview();
      toast.success(res.message || 'Sample cohort loaded!', 'Cohort Loaded');
    } catch (err: any) {
      setStudentsList(ADMIN_STUDENTS);
      toast.info('Sample cohort loaded locally!', 'Cohort Loaded');
    }
  };

  const loadTemplates = async () => {
    try {
      const res = await api.getNotificationTemplates();
      if (res.success && res.data && res.data.length > 0) {
        setTemplatesList(res.data);
      }
    } catch (err) {
      console.warn('Templates fallback');
    }
  };

  const loadAttendance = async (batch = selectedBatch, date = attendanceDate) => {
    try {
      setLoading(true);
      const res = await api.getBatchAttendance(batch, date);
      if (res.success) setAttendanceRecords(res.records);
    } catch (err) {
      console.warn('Attendance load fallback');
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      const res = await api.getPaymentHistory();
      if (res.success && res.data.payments) {
        setPaymentsList(res.data.payments);
      }
    } catch (err) {
      console.warn('Payments load fallback');
    }
  };

  // 1. Mark and Save Attendance
  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    setAttendanceSuccessMsg('');
    try {
      const res = await api.markBatchAttendance({
        batch: selectedBatch,
        date: attendanceDate,
        records: attendanceRecords,
      });

      setAttendanceSuccessMsg(res.message);
      if (res.dispatchedAlerts?.length > 0 && onNotificationSent) {
        onNotificationSent({
          score: res.dispatchedAlerts.length,
          totalMarks: attendanceRecords.length,
          quizTitle: `Batch Attendance Alerts (${selectedBatch})`,
          whatsapp: {
            recipient: `${res.dispatchedAlerts.length} Absent Parents`,
            parentName: 'Automated Dispatch',
            details: 'Urgent WhatsApp alerts dispatched to parents of absent students.',
          },
          email: {
            recipient: 'campus-security@wegrow.edu',
            details: 'Attendance log recorded in campus registry.',
          },
        });
      } else {
        toast.success(res.message || 'Attendance saved successfully! Absentee notifications dispatched.', 'Attendance Saved');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance', 'Attendance Error');
    } finally {
      setSavingAttendance(false);
    }
  };

  const toggleStudentStatus = (index: number, newStatus: string) => {
    const updated = [...attendanceRecords];
    updated[index].status = newStatus;
    if (newStatus === 'absent') {
      updated[index].remarks = 'Absent without prior medical notice';
    } else if (newStatus === 'late') {
      updated[index].remarks = 'Late arrival by 15 mins';
    } else {
      updated[index].remarks = 'Present in campus lab';
    }
    setAttendanceRecords(updated);
  };

  // 2. Upload Assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAsgSuccessMsg('');
    try {
      const res = await api.createAssignment({
        title: asgTitle,
        subject: asgSubject,
        grade: asgBatch,
        dueDate: asgDueDate,
        totalMarks: asgMarks,
        description: asgDesc,
      });
      const msg = res.message || 'Assignment created successfully!';
      setAsgSuccessMsg(msg);
      toast.success(msg, 'Assignment Created');
      setAsgTitle('');
      setAsgDesc('');
      loadAssignments();
      loadOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload assignment', 'Upload Failed');
    }
  };

  // 3. Upload Video
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVidSuccessMsg('');
    try {
      const res = await api.createVideo({
        title: vidTitle,
        subject: vidSubject,
        duration: vidDuration,
        videoUrl: vidUrl,
        teacher: vidTeacher,
      });
      const msg = res.message || 'Video lecture published successfully!';
      setVidSuccessMsg(msg);
      toast.success(msg, 'Video Published');
      setVidTitle('');
      setVidUrl('');
      loadVideos();
      loadOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload video lecture', 'Upload Failed');
    }
  };

  // 4. Upload Daily Notes
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoteSuccessMsg('');
    try {
      const res = await api.createMaterial({
        title: noteTitle,
        subject: noteSubject,
        teacher: noteTeacher,
        summary: noteSummary,
        content: noteContent,
        tags: [noteSubject, 'Official Lecture Notes', 'Sivakasi Campus'],
      });
      const msg = res.message || 'Daily notes published successfully!';
      setNoteSuccessMsg(msg);
      toast.success(msg, 'Notes Published');
      setNoteTitle('');
      setNoteSummary('');
      setNoteContent('');
      loadMaterials();
      loadOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post daily notes', 'Post Failed');
    }
  };

  // 5. Send WhatsApp Message
  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaSending(true);
    setWaSuccessMsg('');
    try {
      const res = await api.broadcastWhatsApp({
        targetBatch: waTargetBatch,
        messageType: waMessageType,
        customMessage: waCustomMessage,
      });
      const msg = res.message || 'WhatsApp message sent to parents successfully!';
      setWaSuccessMsg(msg);
      toast.success(msg, 'WhatsApp Dispatched');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch WhatsApp broadcast', 'Dispatch Failed');
    } finally {
      setWaSending(false);
    }
  };

  // 6. Record Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaySuccessMsg('');
    try {
      const res = await api.recordAdminPayment({
        studentId: payStudentId,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        feeType: payFeeType,
        referenceNumber: payRefNo,
      });
      const msg = res.message || 'Payment recorded successfully!';
      setPaySuccessMsg(msg);
      toast.success(msg, 'Payment Recorded');
      loadPayments();
      loadStudents();
      loadOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment', 'Payment Error');
    }
  };

  // 7. Register New Student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.schoolName || !newStudent.fatherName || !newStudent.fatherPhone || !newStudent.email) {
      toast.warning('Please fill all mandatory fields: Student Name, School Name, Father Name, Father Phone, and Gmail/Email.', 'Missing Fields');
      return;
    }
    setStudentCreating(true);
    setStudentSuccessMsg('');
    try {
      const res = await api.createStudent(newStudent);
      const assignedRoll = res.student?.rollNumber || newStudent.rollNumber || 'WG26-001';
      const assignedPassword = res.student?.password || newStudent.password || `${assignedRoll}@2026`;
      const created = res.student || {
        id: 'std_' + Date.now(),
        ...newStudent,
        rollNumber: assignedRoll,
        password: assignedPassword,
        grade: newStudent.className,
        parentName: newStudent.fatherName,
        parentEmail: newStudent.email,
        parentWhatsApp: newStudent.fatherPhone,
        dueFees: Number(newStudent.totalFees) - Number(newStudent.paidFees),
        status: 'active',
        attendanceRate: 100,
      };
      setStudentsList((prev) => [created, ...prev]);
      const successStr = `Student "${newStudent.name}" enrolled successfully! Roll No: ${assignedRoll} | Password: ${assignedPassword}`;
      setStudentSuccessMsg(successStr);
      toast.success(successStr, 'Student Enrolled');
      setIsNewStudentModalOpen(false);

      // Pre-fetch next sequential enrollment number for the next student
      try {
        const nextRes = await api.getNextEnrollmentNumber();
        const nextRoll = nextRes.nextRollNumber || 'WG26-002';
        setNewStudent({
          name: '',
          rollNumber: nextRoll,
          password: nextRes.defaultPassword || `${nextRoll}@2026`,
          className: 'AI & GenAI Master Track',
          schoolName: '',
          batch: 'Cohort Alpha (12-Month Diploma)',
          fatherName: '',
          motherName: '',
          fatherPhone: '',
          motherPhone: '',
          email: '',
          totalFees: 45000,
          paidFees: 0,
        });
      } catch {
        // Fallback
      }
      loadOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to register student', 'Registration Failed');
    } finally {
      setStudentCreating(false);
    }
  };

  // 8. Delete Student
  const handleDeleteStudent = (id: string, name: string) => {
    confirmModal({
      title: 'Remove Student',
      message: `Are you sure you want to remove student "${name}" from the institutional registry?`,
      confirmText: 'Remove Student',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.deleteStudent(id);
          setStudentsList((prev) => prev.filter((s) => s.id !== id && s._id !== id));
          toast.success(`Student "${name}" has been removed from the registry.`, 'Student Removed');
          loadOverview();
        } catch (err: any) {
          setStudentsList((prev) => prev.filter((s) => s.id !== id && s._id !== id));
          toast.info(`Student "${name}" removed locally.`, 'Student Removed');
        }
      },
    });
  };

  // 9. Apply Notification Template to Direct Student Notice
  const handleApplyDirectTemplate = (tmplId: string, customStudent?: any) => {
    setDirectNotifyTemplateId(tmplId);
    const target = customStudent || notifyingStudent;
    if (!tmplId || !target) return;
    const found = templatesList.find((t) => t.id === tmplId || t._id === tmplId);
    if (!found) return;

    if (found.channel) {
      setNotifyChannel(found.channel as any);
    }

    const sName = target.name || 'Student';
    const sRoll = target.rollNumber || 'WG26-001';
    const sClass = target.grade || target.className || 'AI & GenAI Master Track';
    const sSchool = target.schoolName || 'WeGrow Skill Campus';
    const sFather = target.fatherName || target.parentName || 'Father';
    const sMother = target.motherName || 'Mother';
    const sParent = (target.fatherName && target.motherName && target.fatherName !== target.motherName)
      ? `${target.fatherName} & ${target.motherName}`
      : (target.fatherName || target.parentName || target.motherName || 'Parent');
    const sEmail = target.email || target.parentEmail || '';
    const sUsername = sRoll;
    const sPassword = target.password || `${sRoll}@2026`;
    const sTotalNum = target.totalFees !== undefined ? Number(target.totalFees) : 45000;
    const sPaidNum = target.paidFees !== undefined ? Number(target.paidFees) : 0;
    const sDue = target.dueFees !== undefined ? target.dueFees : Math.max(0, sTotalNum - sPaidNum);
    const sDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    let interpolatedSubject = found.subject || `Update regarding ${sName}`;
    interpolatedSubject = interpolatedSubject
      .replace(/{studentName}/gi, sName)
      .replace(/{student_name}/gi, sName)
      .replace(/{rollNumber}/gi, sRoll)
      .replace(/{username}/gi, sUsername)
      .replace(/{className}/gi, sClass)
      .replace(/{schoolName}/gi, sSchool)
      .replace(/{parentName}/gi, sParent)
      .replace(/{parent_name}/gi, sParent)
      .replace(/{fatherName}/gi, sFather)
      .replace(/{motherName}/gi, sMother);

    let interpolatedBody = found.templateBody || found.customMessage || '';
    interpolatedBody = interpolatedBody
      .replace(/{studentName}/gi, sName)
      .replace(/{student_name}/gi, sName)
      .replace(/{rollNumber}/gi, sRoll)
      .replace(/{roll_no}/gi, sRoll)
      .replace(/{username}/gi, sUsername)
      .replace(/{password}/gi, sPassword)
      .replace(/{email}/gi, sEmail)
      .replace(/{totalFees}/gi, sTotalNum.toLocaleString('en-IN'))
      .replace(/{paidFees}/gi, sPaidNum.toLocaleString('en-IN'))
      .replace(/{dueFees}/gi, sDue.toLocaleString('en-IN'))
      .replace(/{className}/gi, sClass)
      .replace(/{schoolName}/gi, sSchool)
      .replace(/{parentName}/gi, sParent)
      .replace(/{parent_name}/gi, sParent)
      .replace(/{fatherName}/gi, sFather)
      .replace(/{motherName}/gi, sMother)
      .replace(/{date}/gi, sDate)
      .replace(/https:\/\/wegrowskillcampus\.edu\/portal/gi, 'https://school.wegrowbschool.in/#login')
      .replace(/\*/g, ''); // Remove stars (asterisks) for clean notification content

    setNotifySubject(interpolatedSubject);
    setNotifyMessage(interpolatedBody);
  };

  // 9. Send Direct WhatsApp / Email to Student's Parents
  const handleSendDirectNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyingStudent) return;
    setNotifySending(true);
    setNotifySuccessMsg('');
    try {
      const studentId = notifyingStudent.id || notifyingStudent._id;
      const res = await api.notifyStudent(studentId, {
        channel: notifyChannel,
        subject: notifySubject,
        customMessage: notifyMessage,
      });
      const successStr = res.message || 'Notification dispatched successfully to student parents via official API.';
      setNotifySuccessMsg(successStr);
      if (onNotificationSent) {
        onNotificationSent({
          score: 1,
          totalMarks: 1,
          quizTitle: `Direct Notice: ${notifyingStudent.name}`,
          whatsapp: {
            recipient: notifyingStudent.fatherPhone || notifyingStudent.parentWhatsApp || '+91 98765 43210',
            parentName: notifyingStudent.fatherName || notifyingStudent.parentName || 'Parent',
            details: notifyMessage.slice(0, 80) + '...',
          },
          email: {
            recipient: notifyingStudent.email || notifyingStudent.parentEmail || 'parent@gmail.com',
            details: notifySubject,
          },
        });
      } else {
        toast.success(successStr, 'Notification Sent');
      }
      setTimeout(() => {
        setNotifyingStudent(null);
        setNotifySuccessMsg('');
        setNotifyMessage('');
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch direct notification', 'Dispatch Failed');
    } finally {
      setNotifySending(false);
    }
  };

  // 10. Create Notification Template
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.title || !newTemplate.templateBody) {
      toast.warning('Please provide a Template Title and Message Body', 'Missing Info');
      return;
    }
    setTemplateCreating(true);
    try {
      const res = await api.createNotificationTemplate(newTemplate);
      const created = res.data || {
        id: 'tmpl_' + Date.now(),
        ...newTemplate,
        createdAt: new Date().toISOString(),
      };
      setTemplatesList((prev) => [created, ...prev]);
      toast.success('Notification template saved successfully!', 'Template Saved');
      setIsNewTemplateModalOpen(false);
      setNewTemplate({
        title: '',
        category: 'Attendance',
        channel: 'both',
        subject: '',
        templateBody: '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save notification template', 'Save Failed');
    } finally {
      setTemplateCreating(false);
    }
  };

  // 11. Delete Notification Template
  const handleDeleteTemplate = (id: string) => {
    confirmModal({
      title: 'Delete Notification Template',
      message: 'Are you sure you want to delete this notification template?',
      confirmText: 'Delete Template',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.deleteNotificationTemplate(id);
          setTemplatesList((prev) => prev.filter((t) => t.id !== id && t._id !== id));
          toast.success('Notification template deleted successfully.', 'Template Deleted');
        } catch (err: any) {
          setTemplatesList((prev) => prev.filter((t) => t.id !== id && t._id !== id));
          toast.info('Template deleted locally.', 'Template Deleted');
        }
      },
    });
  };

  // 12. Send Bulk Broadcast Notification
  const handleSendBulkNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkSending(true);
    setBulkSuccessMsg('');
    try {
      const res = await api.broadcastNotification({
        channel: bulkChannel,
        targetBatch: bulkTargetBatch,
        templateId: selectedTemplateId,
        customSubject: bulkCustomSubject,
        customMessage: bulkCustomMessage,
      });

      const count = res.dispatchedCount || studentsList.length;
      const successStr = res.message || `Broadcast successfully delivered to ${count} parents via ${bulkChannel.toUpperCase()} API!`;
      setBulkSuccessMsg(successStr);

      setBulkBroadcastHistory((prev) => [
        {
          id: 'b_' + Date.now(),
          date: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          target: bulkTargetBatch,
          channel: bulkChannel === 'both' ? 'Both (WhatsApp & Email)' : bulkChannel === 'whatsapp' ? 'WhatsApp API' : 'Email API',
          title: bulkCustomSubject || 'Official Broadcast',
          recipientCount: count,
          status: 'Delivered',
        },
        ...prev,
      ]);

      if (onNotificationSent) {
        onNotificationSent({
          score: count,
          totalMarks: count,
          quizTitle: `Bulk Broadcast (${bulkTargetBatch})`,
          whatsapp: {
            recipient: `${count} Parents`,
            parentName: 'Cohort Group Broadcast',
            details: bulkCustomMessage.slice(0, 90) + '...',
          },
          email: {
            recipient: 'broadcast-center@wegrow.edu',
            details: bulkCustomSubject,
          },
        });
      } else {
        toast.success(successStr, 'Broadcast Dispatched');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch bulk broadcast', 'Broadcast Failed');
    } finally {
      setBulkSending(false);
    }
  };

  // 7. Printable PDF Tax Invoice Generator
  const downloadOfficialTaxInvoice = (p: any, studentObj?: any) => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      toast.warning('Please allow popups to view and download the official PDF invoice.', 'Popup Blocked');
      return;
    }

    const sName = studentObj?.name || p.studentName || 'Aarav Sharma';
    const sRoll = studentObj?.rollNumber || 'WG-2026-AI04';
    const sBatch = studentObj?.batch || 'Cohort Alpha (12-Month Diploma)';
    const sParent = studentObj?.parentName || 'Rajesh Sharma';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${p.receiptNumber} | WeGrow Skill Campus</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 40px; color: #0F172A; background: #fff; }
          .invoice-box { max-width: 780px; margin: 0 auto; border: 2px solid #0B1F4D; border-radius: 12px; padding: 36px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F26A1B; padding-bottom: 18px; }
          .brand-title { font-size: 26px; font-weight: 900; color: #0B1F4D; }
          .brand-orange { color: #F26A1B; }
          .invoice-tag { font-size: 12px; font-weight: 800; background: #FFE9D9; color: #E5530A; padding: 4px 12px; border-radius: 6px; }
          .title { text-align: center; font-size: 20px; font-weight: 800; margin: 24px 0 16px; text-transform: uppercase; letter-spacing: 1.5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 13.5px; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #E2E8F0; }
          .label { color: #64748B; font-weight: 600; }
          .val { font-weight: 700; color: #0F172A; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
          th { background: #0B1F4D; color: #fff; padding: 10px 14px; text-align: left; }
          td { padding: 12px 14px; border-bottom: 1px solid #E2E8F0; }
          .total { background: #F8FAFC; font-weight: 800; font-size: 16px; }
          .stamp { border: 2px solid #10B981; color: #10B981; font-weight: 900; padding: 6px 18px; border-radius: 8px; font-size: 14px; text-transform: uppercase; transform: rotate(-5deg); display: inline-block; }
          .btn-print { background: #F26A1B; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; max-width: 780px; margin: 0 auto 10px;">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save Official PDF Invoice</button>
        </div>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="brand-title">We<span class="brand-orange">Grow</span> Skill Campus &amp; B School</div>
              <div style="font-size: 12px; color: #3A4560; font-weight: 600;">Sivakasi Campus • GSTIN: 33AAECW1234F1Z8</div>
            </div>
            <div style="text-align: right;">
              <span class="invoice-tag">OFFICIAL GST FEE INVOICE</span>
              <div style="font-size: 12px; color: #64748B; margin-top: 6px;">ISO 9001:2015 Accredited</div>
            </div>
          </div>

          <div class="title">Tuition &amp; Educational Service Invoice</div>

          <div class="grid">
            <div>
              <div class="row"><span class="label">Invoice / Receipt #:</span><span class="val">${p.receiptNumber}</span></div>
              <div class="row"><span class="label">Date of Issue:</span><span class="val">${new Date(p.date).toLocaleDateString('en-IN')}</span></div>
              <div class="row"><span class="label">Payment Mode:</span><span class="val">${p.method || 'Razorpay Online'}</span></div>
              <div class="row"><span class="label">Transaction Ref:</span><span class="val">${p.referenceNumber || p.paymentId || 'TXN_WEGROW_' + Math.random().toString(36).slice(-6)}</span></div>
            </div>
            <div>
              <div class="row"><span class="label">Student Name:</span><span class="val">${sName}</span></div>
              <div class="row"><span class="label">Roll Number:</span><span class="val">${sRoll}</span></div>
              <div class="row"><span class="label">Enrolled Batch:</span><span class="val">${sBatch}</span></div>
              <div class="row"><span class="label">Parent / Sponsor:</span><span class="val">${sParent}</span></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Academic Description</th>
                <th>SAC Code</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><strong>${p.feeType || 'Curriculum Tuition Fee'}</strong><br><small style="color: #64748B;">Core AI, Python Coding, Machine Learning &amp; Faculty Supervision</small></td>
                <td>999293</td>
                <td style="text-align: right; font-weight: 600;">₹${(p.amount * 0.75).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>2</td>
                <td><strong>Cloud GPU Computing &amp; Hands-on Robotics Hardware Kit</strong><br><small style="color: #64748B;">Dedicated server infrastructure &amp; sensors allocation</small></td>
                <td>999294</td>
                <td style="text-align: right; font-weight: 600;">₹${(p.amount * 0.25).toLocaleString('en-IN')}</td>
              </tr>
              <tr class="total">
                <td colspan="3" style="text-align: right; font-weight: 800;">TOTAL INVOICE AMOUNT PAID:</td>
                <td style="text-align: right; font-size: 18px; font-weight: 900; color: #0B1F4D;">₹${p.amount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 14px 20px; border-radius: 8px;">
            <div>
              <div style="font-weight: 700; color: #166534; font-size: 13.5px;">Payment Cleared &amp; Credited to WeGrow Institution Account</div>
              <div style="font-size: 11.5px; color: #15803D;">Status: Full Tax Receipt Validated</div>
            </div>
            <div class="stamp">✓ PAID</div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 20px;">
            <div>
              <div>WeGrow Skill Campus &amp; B School, Sivakasi</div>
              <div>Administrative Block, Tamil Nadu 626123</div>
              <div>Support: admin@wegrow.edu | +91 98765 00001</div>
            </div>
            <div style="text-align: center;">
              <div style="width: 180px; height: 1px; background: #0F172A; margin: 30px auto 6px;"></div>
              <strong>Director of Finance &amp; Operations</strong>
              <div>WeGrow Skill Campus</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="page-container">
      {/* Top Admin Banner */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(11, 31, 77, 0.95) 0%, rgba(37, 99, 235, 0.25) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, flex: '1 1 300px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F26A1B 0%, #E5530A 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(242, 106, 27, 0.4)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: 'rgba(242, 106, 27, 0.25)', color: '#fed7aa', letterSpacing: '0.8px' }}>
                SUPER ADMIN &bull; CAMPUS DIRECTOR
              </span>
              <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>
                ● Full Operational Clearance
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 900, color: '#ffffff', margin: '4px 0 2px', wordBreak: 'break-word' }}>
              WeGrow Campus &amp; Academic Administration Control Center
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
              Direct control for batch attendance, assignment uploads, video lectures, notes publishing, parent WhatsApp alerts, and payment invoices.
            </p>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => switchTab('attendance')}
            className="btn btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              fontWeight: 700,
              padding: '8px 14px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
          >
            <CalendarCheck size={14} style={{ color: '#38bdf8' }} /> Batch Attendance
          </button>
          <button
            onClick={() => switchTab('whatsapp')}
            className="btn btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(37, 211, 102, 0.28)',
              border: '1px solid rgba(37, 211, 102, 0.65)',
              color: '#ffffff',
              fontWeight: 700,
              padding: '8px 14px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
          >
            <MessageCircle size={14} style={{ color: '#4ade80' }} /> Parent WhatsApp
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Admin */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-glass)',
        }}
      >
        <button
          onClick={() => switchTab('overview')}
          className={`btn ${currentTab === 'overview' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Sparkles size={14} /> Dashboard Overview
        </button>
        <button
          onClick={() => switchTab('students')}
          className={`btn ${currentTab === 'students' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Users size={14} /> Student Admissions
        </button>
        <button
          onClick={() => switchTab('attendance')}
          className={`btn ${currentTab === 'attendance' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <CalendarCheck size={14} /> Batch Attendance
        </button>
        <button
          onClick={() => switchTab('quizzes')}
          className={`btn ${currentTab === 'quizzes' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <FileText size={14} /> Upload Quizzes ({quizzesList.length})
        </button>
        <button
          onClick={() => switchTab('assignments')}
          className={`btn ${currentTab === 'assignments' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <ClipboardList size={14} /> Upload Assignments ({assignmentsList.length})
        </button>
        <button
          onClick={() => switchTab('videos')}
          className={`btn ${currentTab === 'videos' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Video size={14} /> Video Lectures ({videosList.length})
        </button>
        <button
          onClick={() => switchTab('notes')}
          className={`btn ${currentTab === 'notes' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <BookOpen size={14} /> Daily Notes ({materialsList.length})
        </button>
        <button
          onClick={() => switchTab('finance')}
          className={`btn ${currentTab === 'finance' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <CreditCard size={14} /> Fees &amp; Invoices
        </button>
        <button
          onClick={() => switchTab('whatsapp')}
          className={`btn ${currentTab === 'whatsapp' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <MessageCircle size={14} /> WhatsApp Parent Alerts
        </button>
        <button
          onClick={() => switchTab('templates')}
          className={`btn ${currentTab === 'templates' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Bell size={14} /> Notification Templates
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW DASHBOARD                                */}
      {/* ======================================================== */}
      {currentTab === 'overview' && (
        <div>
          {/* Metrics Grid */}
          <div className="stats-grid" style={{ marginBottom: '28px' }}>
            <div className="glass-card stat-card">
              <div>
                <div className="stat-title">Total Enrolled Students</div>
                <div className="stat-value">{overview?.totalStudents ?? studentsList.length}</div>
                <div className="stat-subtitle">Across 3 Specialized Tracks</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-blue">
                <Users size={24} />
              </div>
            </div>

            <div className="glass-card stat-card">
              <div>
                <div className="stat-title">Fee Revenue Collected</div>
                <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                  ₹{(overview?.totalCollected ?? (studentsList.reduce((acc: number, s: any) => acc + (s.paidFees || 0), 0))).toLocaleString('en-IN')}
                </div>
                <div className="stat-subtitle" style={{ color: '#10b981' }}>
                  ✓ Razorpay &amp; Bank Verified
                </div>
              </div>
              <div className="stat-icon-wrapper stat-icon-green">
                <CreditCard size={24} />
              </div>
            </div>

            <div className="glass-card stat-card">
              <div>
                <div className="stat-title">Outstanding Fee Balance</div>
                <div className="stat-value" style={{ color: '#d97706' }}>
                  ₹{(overview?.totalOutstanding ?? (studentsList.reduce((acc: number, s: any) => acc + (s.dueFees || 0), 0))).toLocaleString('en-IN')}
                </div>
                <div className="stat-subtitle">Available for Parent Reminder</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-amber">
                <AlertCircle size={24} />
              </div>
            </div>

            <div className="glass-card stat-card">
              <div>
                <div className="stat-title">Campus Attendance Continuity</div>
                <div className="stat-value" style={{ color: '#10b981' }}>
                  {overview?.avgAttendance ?? 100}%
                </div>
                <div className="stat-subtitle">Campus Security Synced</div>
              </div>
              <div className="stat-icon-wrapper stat-icon-purple">
                <CalendarCheck size={24} />
              </div>
            </div>
          </div>

          {/* Quick Upload Action Cards */}
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Quick Administrative Operations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div
              className="glass-card glass-card-interactive"
              onClick={() => switchTab('attendance')}
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarCheck size={20} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Mark Batch Attendance
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Record daily presence by cohort and automatically trigger WhatsApp alerts to parents of absent students.
              </p>
            </div>

            <div
              className="glass-card glass-card-interactive"
              onClick={() => switchTab('assignments')}
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(242, 106, 27, 0.15)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Upload New Assignment
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Set problem statements, code review deadlines, submission criteria, and evaluation marks.
              </p>
            </div>

            <div
              className="glass-card glass-card-interactive"
              onClick={() => switchTab('videos')}
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={20} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Publish Video Lecture
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Add lecture recordings from Google Meet, Vimeo, or YouTube directly to the student portal.
              </p>
            </div>

            <div
              className="glass-card glass-card-interactive"
              onClick={() => switchTab('notes')}
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Post Daily Class Notes
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Publish code snippets, theory summaries, and PDF download links for each completed lecture.
              </p>
            </div>

            <div
              className="glass-card glass-card-interactive"
              onClick={() => switchTab('whatsapp')}
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={20} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Send WhatsApp Broadcast
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Broadcast emergency campus notices, fee reminders, or exam scorecards directly to parent WhatsApp.
              </p>
            </div>

            <div
              className="glass-card glass-card-interactive"
              onClick={() => switchTab('finance')}
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(147, 51, 234, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Record Payment &amp; Invoice
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Log manual payments, verify transactions, and generate official printable GST receipts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BATCH-WISE ATTENDANCE MONITORING                  */}
      {/* ======================================================== */}
      {currentTab === 'attendance' && (
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Batch-Wise Attendance Monitoring &amp; Security Dispatch
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Review and record student lab presence. Parents of absent students will receive an automated WhatsApp notification.
              </p>
            </div>

            {/* Batch & Date Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  loadAttendance(e.target.value, attendanceDate);
                }}
                className="input-field"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}
              >
                <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
              </select>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => {
                  setAttendanceDate(e.target.value);
                  loadAttendance(selectedBatch, e.target.value);
                }}
                className="input-field"
                style={{ width: 'auto', padding: '8px 14px', fontSize: '13px' }}
              />
            </div>
          </div>

          {attendanceSuccessMsg && (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                marginBottom: '20px',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CheckCircle size={18} />
              <span>{attendanceSuccessMsg}</span>
            </div>
          )}

          {/* Student Attendance Table */}
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Student</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Roll Number</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Parent Name</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>WhatsApp Phone</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Attendance Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((r, idx) => (
                  <tr key={r.studentId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {r.name}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {r.rollNumber}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {r.parentName}
                    </td>
                    <td style={{ padding: '14px', color: '#10b981', fontWeight: 600 }}>
                      {r.parentWhatsApp}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', background: 'var(--bg-glass)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(idx, 'present')}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background: r.status === 'present' ? '#10b981' : 'transparent',
                            color: r.status === 'present' ? '#ffffff' : 'var(--text-muted)',
                            transition: 'all 0.15s',
                          }}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(idx, 'late')}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background: r.status === 'late' ? '#f59e0b' : 'transparent',
                            color: r.status === 'late' ? '#ffffff' : 'var(--text-muted)',
                            transition: 'all 0.15s',
                          }}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(idx, 'absent')}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background: r.status === 'absent' ? '#ef4444' : 'transparent',
                            color: r.status === 'absent' ? '#ffffff' : 'var(--text-muted)',
                            transition: 'all 0.15s',
                          }}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <input
                        type="text"
                        value={r.remarks}
                        onChange={(e) => {
                          const updated = [...attendanceRecords];
                          updated[idx].remarks = e.target.value;
                          setAttendanceRecords(updated);
                        }}
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: '12.5px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
            <button
              onClick={() => loadAttendance(selectedBatch, attendanceDate)}
              className="btn btn-secondary"
            >
              <RefreshCw size={15} /> Reset Roster
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={savingAttendance}
              className="btn btn-primary"
              style={{ padding: '11px 24px', fontSize: '14.5px' }}
            >
              {savingAttendance ? 'Saving & Alerting Parents...' : 'Save Attendance & Dispatch WhatsApp to Absent Parents'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: QUIZZES & ASSESSMENTS UPLOAD                        */}
      {/* ======================================================== */}
      {currentTab === 'quizzes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {/* Create Quiz Form */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Create &amp; Upload New Quiz / Evaluation
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Publish multiple choice tests with automatic scoring, grading, and parent WhatsApp &amp; Email scorecard alerts.
            </p>

            {quizSuccessMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                ✓ {quizSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Generative AI &amp; LLM Fundamentals"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Subject Track</label>
                  <select
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    className="input-field"
                  >
                    <option value="Generative AI &amp; LLMs">Generative AI &amp; LLMs</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Natural Language Processing">Natural Language Processing</option>
                    <option value="Python &amp; PyTorch">Python &amp; PyTorch</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={quizDuration}
                    onChange={(e) => setQuizDuration(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Passing Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={quizPassingMarks}
                    onChange={(e) => setQuizPassingMarks(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Questions Included</label>
                  <div style={{ padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
                    {quizQuestions.length} Questions
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">Quiz Description</label>
                <textarea
                  rows={2}
                  value={quizDesc}
                  onChange={(e) => setQuizDesc(e.target.value)}
                  placeholder="Brief summary of concepts evaluated in this test..."
                  className="input-field"
                />
              </div>

              {/* Questions List Editor */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="input-label" style={{ margin: 0, fontWeight: 800 }}>Questions ({quizQuestions.length})</label>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizQuestions((prev) => [
                        ...prev,
                        {
                          id: `q${prev.length + 1}`,
                          questionText: '',
                          options: ['', '', '', ''],
                          correctOptionIndex: 0,
                          marks: 5,
                          explanation: '',
                        },
                      ]);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    + Add Question
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-orange)' }}>Question {qIdx + 1}</span>
                        {quizQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuizQuestions((prev) => prev.filter((_, idx) => idx !== qIdx));
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Enter question text..."
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qIdx].questionText = e.target.value;
                          setQuizQuestions(updated);
                        }}
                        className="input-field"
                        style={{ marginBottom: '8px', fontSize: '12.5px' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options.map((opt: string, optIdx: number) => (
                          <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => {
                                const updated = [...quizQuestions];
                                updated[qIdx].correctOptionIndex = optIdx;
                                setQuizQuestions(updated);
                              }}
                            />
                            <input
                              type="text"
                              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                              value={opt}
                              onChange={(e) => {
                                const updated = [...quizQuestions];
                                updated[qIdx].options[optIdx] = e.target.value;
                                setQuizQuestions(updated);
                              }}
                              className="input-field"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={quizSubmitting}
                className="btn btn-primary"
                style={{ marginTop: '10px', padding: '10px' }}
              >
                {quizSubmitting ? 'Publishing to Database...' : 'Publish Quiz to Student Portal'}
              </button>
            </form>
          </div>

          {/* Published Quizzes List */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Live Active Quizzes Catalog ({quizzesList.length})
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Stored in database. Available live in student portal for assessment.
                </p>
              </div>
              <button onClick={loadQuizzes} className="btn btn-secondary btn-sm">
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {quizzesList.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
                <FileText size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  No Quizzes Active (0)
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  All static seed data has been removed. Use the form on the left to upload your first live evaluation task.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                {quizzesList.map((quiz) => (
                  <div
                    key={quiz._id}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-light)' }}>
                          {quiz.subject}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '6px 0 2px', color: 'var(--text-primary)' }}>
                          {quiz.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete Quiz"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                      {quiz.description || 'Evaluation assessment task'}
                    </p>

                    <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span>Questions: <strong style={{ color: 'var(--text-primary)' }}>{quiz.questionCount || quiz.questions?.length || 0}</strong></span>
                      <span>Duration: <strong style={{ color: 'var(--text-primary)' }}>{quiz.durationMinutes}m</strong></span>
                      <span>Max Marks: <strong style={{ color: '#38bdf8' }}>{quiz.totalMarks}</strong></span>
                      <span>Due: <strong style={{ color: 'var(--text-primary)' }}>{quiz.dueDate}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ASSIGNMENT UPLOAD                                 */}
      {/* ======================================================== */}
      {currentTab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {/* Create Assignment Form */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Create &amp; Upload New Student Assignment
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Assign coding projects, machine learning pipeline tasks, and problem sets to enrolled cohorts.
            </p>

            {asgSuccessMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                ✓ {asgSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Real-Time Gesture Recognition with MediaPipe"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '14px' }}>
                <div>
                  <label className="input-label">Discipline / Subject</label>
                  <select
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value)}
                    className="input-field"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Deep Learning & CV">Deep Learning &amp; CV</option>
                    <option value="Generative AI & LLMs">Generative AI &amp; LLMs</option>
                    <option value="Python & Data Science">Python &amp; Data Science</option>
                    <option value="Agentic AI Automation">Agentic AI Automation</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Target Cohort / Batch</label>
                  <select
                    value={asgBatch}
                    onChange={(e) => setAsgBatch(e.target.value)}
                    className="input-field"
                  >
                    <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                    <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                    <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '14px' }}>
                <div>
                  <label className="input-label">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Total Marks</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={asgMarks}
                    onChange={(e) => setAsgMarks(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Task Description &amp; Technical Requirements</label>
                <textarea
                  required
                  rows={4}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Detail the dataset, starter code instructions, validation metrics, and required deliverables..."
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                <Plus size={16} /> Publish Assignment to Student Portal
              </button>
            </form>
          </div>

          {/* Active Assignments Catalog */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Currently Active Assignments ({assignmentsList.length})
            </h3>
            {assignmentsList.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <ClipboardList size={36} style={{ margin: '0 auto 10px', opacity: 0.6, color: 'var(--primary-light)' }} />
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>No active assignments published yet (0)</div>
                <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                  Use the upload form above to create and publish homework or capstone projects to students.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignmentsList.map((a: any) => (
                  <div
                    key={a._id}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.12)' }}>
                        {a.subject}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Due: {a.dueDate}
                        </span>
                        <button
                          onClick={() => handleDeleteAssignment(a._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Delete Assignment"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '2px 0 6px', color: 'var(--text-primary)' }}>
                      {a.title}
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {a.description}
                    </p>
                    <div style={{ marginTop: '10px', fontSize: '11.5px', color: '#10b981', fontWeight: 700 }}>
                      Max Score: {a.totalMarks} Marks &bull; Submissions Logged: {a.submissions?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: VIDEO LECTURE UPLOAD                              */}
      {/* ======================================================== */}
      {currentTab === 'videos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Upload Video Lecture to Student Portal
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Add cloud lecture recordings, tutorial screencasts, and masterclasses to the student video player.
            </p>

            {vidSuccessMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                ✓ {vidSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateVideo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Lecture Video Title</label>
                <input
                  type="text"
                  required
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Fine-Tuning Llama 3 with LoRA and QLoRA"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '14px' }}>
                <div>
                  <label className="input-label">Discipline / Subject</label>
                  <select
                    value={vidSubject}
                    onChange={(e) => setVidSubject(e.target.value)}
                    className="input-field"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Deep Learning & CV">Deep Learning &amp; CV</option>
                    <option value="Generative AI & LLMs">Generative AI &amp; LLMs</option>
                    <option value="Python & Data Science">Python &amp; Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Video Duration</label>
                  <input
                    type="text"
                    required
                    value={vidDuration}
                    onChange={(e) => setVidDuration(e.target.value)}
                    placeholder="e.g. 52 mins"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Video Stream / Embed URL (YouTube, Vimeo, Cloud)</label>
                <input
                  type="url"
                  required
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or cloud storage video link"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Lead Faculty / Instructor</label>
                <input
                  type="text"
                  required
                  value={vidTeacher}
                  onChange={(e) => setVidTeacher(e.target.value)}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                <Plus size={16} /> Publish Video to Student Library
              </button>
            </form>
          </div>

          {/* Videos Catalog Preview */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Published Video Library ({videosList.length})
            </h3>
            {videosList.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Video size={36} style={{ margin: '0 auto 10px', opacity: 0.6, color: 'var(--primary-light)' }} />
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>No video lectures published yet (0)</div>
                <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                  Use the upload form above to add recorded classes and AI masterclasses for enrolled students.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
                {videosList.map((v: any) => (
                  <div
                    key={v._id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}
                      alt={v.title}
                      style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--primary-light)' }}>
                        {v.subject} &bull; {v.duration || '45 mins'}
                      </span>
                      <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '2px 0', color: 'var(--text-primary)' }}>
                        {v.title}
                      </h5>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>By {v.teacher}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: DAILY NOTES UPLOAD                                */}
      {/* ======================================================== */}
      {currentTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Publish Daily Class Notes &amp; Study Material
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Post structured theory notes, code syntax references, and practical formulas for students.
            </p>

            {noteSuccessMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                ✓ {noteSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Notes Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Daily Class Notes: Transformer Self-Attention & QKV Projection"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '14px' }}>
                <div>
                  <label className="input-label">Subject</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="input-field"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Deep Learning & CV">Deep Learning &amp; CV</option>
                    <option value="Generative AI & LLMs">Generative AI &amp; LLMs</option>
                    <option value="Python & Data Science">Python &amp; Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Instructor Name</label>
                  <input
                    type="text"
                    required
                    value={noteTeacher}
                    onChange={(e) => setNoteTeacher(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Quick Summary</label>
                <input
                  type="text"
                  required
                  value={noteSummary}
                  onChange={(e) => setNoteSummary(e.target.value)}
                  placeholder="One sentence summary of the key takeaways..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Complete Lecture Content (Supports Markdown &amp; Formulas)</label>
                <textarea
                  required
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write or paste comprehensive class notes, code snippets, equations, and references..."
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                <Plus size={16} /> Publish Daily Notes to Student Feed
              </button>
            </form>
          </div>

          {/* Published Notes Catalog */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Published Daily Notes Catalog ({materialsList.length})
            </h3>
            {materialsList.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <BookOpen size={36} style={{ margin: '0 auto 10px', opacity: 0.6, color: 'var(--primary-light)' }} />
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>No daily class notes published yet (0)</div>
                <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                  Use the upload form above to post lecture notes, code cheat sheets, and theory summaries.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
                {materialsList.map((m: any) => (
                  <div
                    key={m._id}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-light)' }}>
                        {m.subject}
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{m.date}</span>
                    </div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '2px 0 4px', color: 'var(--text-primary)' }}>
                      {m.title}
                    </h5>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{m.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: WHATSAPP PARENT ALERTS BROADCAST                  */}
      {/* ======================================================== */}
      {currentTab === 'whatsapp' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {/* Dispatcher Form */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(37, 211, 102, 0.2)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={20} />
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Live WhatsApp Parent Message Dispatcher
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Send instant official alerts, exam evaluations, and notices directly to registered WhatsApp numbers of parents.
            </p>

            {waSuccessMsg && (
              <div style={{ padding: '12px', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                ✓ {waSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSendWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Select Target Audience</label>
                <select
                  value={waTargetBatch}
                  onChange={(e) => setWaTargetBatch(e.target.value)}
                  className="input-field"
                >
                  <option value="All">All Parents (Campus-Wide Broadcast)</option>
                  <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                  <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                  <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Message Template Type</label>
                <select
                  value={waMessageType}
                  onChange={(e) => {
                    setWaMessageType(e.target.value);
                    if (e.target.value === 'absence') {
                      setWaCustomMessage("Notice: Your ward was not present during today's mandatory lab session. Please contact the campus mentor.");
                    } else if (e.target.value === 'fee') {
                      setWaCustomMessage('Gentle Reminder: The 2nd installment for the AI Master Track is due on 25th Oct. Please settle online via Razorpay in the student portal.');
                    } else if (e.target.value === 'score') {
                      setWaCustomMessage('Academic Achievement: The latest Diagnostic Test results have been released. Your ward scored above the cohort average! Full report on portal.');
                    } else {
                      setWaCustomMessage('Campus Update: Special AI Innovation Hackathon scheduled for this Saturday at Sivakasi Tech Lab. Attendance is recommended.');
                    }
                  }}
                  className="input-field"
                >
                  <option value="absence">🚨 Urgent Absence Notice</option>
                  <option value="fee">💳 Fee Due &amp; Payment Reminder</option>
                  <option value="score">📊 Test Scorecard &amp; Progress Report</option>
                  <option value="general">📢 General Academic &amp; Exam Announcement</option>
                </select>
              </div>

              <div>
                <label className="input-label">Message Content</label>
                <textarea
                  required
                  rows={5}
                  value={waCustomMessage}
                  onChange={(e) => setWaCustomMessage(e.target.value)}
                  placeholder="Enter message to be delivered to parents on WhatsApp..."
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={waSending}
                className="btn btn-success"
                style={{ padding: '12px', background: '#25D366', color: '#ffffff', fontWeight: 800 }}
              >
                <Send size={16} /> {waSending ? 'Dispatching via WhatsApp Gateway...' : 'Send Live WhatsApp to Parents'}
              </button>
            </form>
          </div>

          {/* Live Phone Mockup Preview */}
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Live Parent Phone Preview
                </span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(37, 211, 102, 0.2)', color: '#25D366', fontWeight: 700 }}>
                  WhatsApp Official Template
                </span>
              </div>

              {/* Chat Bubble Card */}
              <div
                style={{
                  background: '#075E54',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: '12px 12px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/wegrow-logo.webp" alt="WeGrow" width={28} height={20} style={{ height: '20px', width: 'auto' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>WeGrow Skill Campus Sivakasi ✓</div>
                  <div style={{ fontSize: '10.5px', opacity: 0.8 }}>Official Verified Business Account</div>
                </div>
              </div>

              <div
                style={{
                  background: '#ECE5DD',
                  padding: '18px',
                  borderRadius: '0 0 12px 12px',
                  color: '#111827',
                  minHeight: '240px',
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    padding: '14px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#075E54', marginBottom: '6px' }}>
                    📢 WeGrow Skill Campus &amp; B School Announcement
                  </div>
                  <div>Dear Parent:</div>
                  <div style={{ margin: '8px 0', fontWeight: 500 }}>
                    {waCustomMessage || "Notice: Your ward's attendance and academic progress have been updated on the student portal."}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280', borderTop: '1px solid #F3F4F6', paddingTop: '6px', marginTop: '8px' }}>
                    Student Roll No: WG-2026-AI04 | Sivakasi Campus Reception: +91 98765 00001
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
                    10:45 AM &bull; Delivered ✓✓
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              ⚡ Powered by Twilio WhatsApp Business API &amp; Automated Webhook Gateway.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: PAYMENT & PAYOUT INVOICES                         */}
      {/* ======================================================== */}
      {currentTab === 'finance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {/* Record Manual Payment Form */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Record Manual Payment &amp; Issue Receipt
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Accept cash, cheque, bank transfer, or offline UPI payments and generate a system-verified tax invoice.
            </p>

            {paySuccessMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                ✓ {paySuccessMsg}
              </div>
            )}

            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Select Student</label>
                <select
                  value={payStudentId}
                  onChange={(e) => setPayStudentId(e.target.value)}
                  className="input-field"
                >
                  {ADMIN_STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) — Due: ₹{s.dueFees.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '14px' }}>
                <div>
                  <label className="input-label">Payment Amount (INR)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="0"
                    value={payAmount === 0 ? '' : payAmount}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPayAmount(v === '' ? 0 : Number(v));
                    }}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="input-field"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                    <option value="Cash">Cash at Campus Desk</option>
                    <option value="Cheque">Demand Draft / Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Fee Head / Description</label>
                <input
                  type="text"
                  required
                  value={payFeeType}
                  onChange={(e) => setPayFeeType(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Bank Reference / Cheque / UTR #</label>
                <input
                  type="text"
                  value={payRefNo}
                  onChange={(e) => setPayRefNo(e.target.value)}
                  placeholder="e.g. UTR4928174928"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                <Plus size={16} /> Record Payment &amp; Issue Official Receipt
              </button>
            </form>
          </div>

          {/* Master Payment Transactions Ledger */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Master Payment Ledger &amp; Tax Invoices
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Receipt #</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Student</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Tax Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {p.receiptNumber}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                        {p.studentName || 'Aarav Sharma'}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => downloadOfficialTaxInvoice(p)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        >
                          <Download size={12} /> PDF Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: STUDENT DETAILS & ADMISSIONS REGISTRY             */}
      {/* ======================================================== */}
      {currentTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={22} style={{ color: 'var(--brand-orange)' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Student Details &amp; Admissions Registry
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Manage student profiles, view father/mother contact numbers &amp; Gmail, and send direct WhatsApp or Email notifications.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleResetRoster}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '12px', color: '#fb7185' }}
                  title="Clear roster and reset next enrollment to WG26-001"
                >
                  <RefreshCw size={14} />
                  <span>Reset (Start WG26-001)</span>
                </button>


                <button
                  id="btn-admin-add-student"
                  onClick={handleOpenNewStudentModal}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 700 }}
                >
                  <UserPlus size={16} />
                  <span>+ Register New Student</span>
                </button>
              </div>
            </div>

            {/* Success message banner */}
            {studentSuccessMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  color: '#34d399',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} />
                  <span>{studentSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setStudentSuccessMsg('')}
                  style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search by student name, roll no (WG26-001), school, class, father or mother phone..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '40px', width: '100%', fontSize: '13px' }}
                />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Total Records: {studentsList.length} Students
              </span>
            </div>
          </div>

          {/* Students Registry Table */}
          <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Student &amp; Credentials</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Class &amp; Track</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>School Name</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Father Details</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Mother Details</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Gmail / Email</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Fees Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Direct Notifications</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <Users size={32} style={{ color: 'var(--brand-orange)', opacity: 0.7 }} />
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                          No students in the roster yet
                        </div>
                        <p style={{ fontSize: '13px', margin: 0, maxWidth: '440px', color: 'var(--text-secondary)' }}>
                          Institutional enrollment starts sequentially with <span style={{ color: 'var(--brand-orange)', fontWeight: 800 }}>WG26-001</span>.
                          Click <strong>+ Register New Student</strong> to enroll a student with an admin-assigned password.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                          <button
                            onClick={handleOpenNewStudentModal}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '8px 16px', fontWeight: 700 }}
                          >
                            + Register Student (Starts WG26-001)
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {studentsList
                  .filter((s) => {
                    if (!studentSearch.trim()) return true;
                    const query = studentSearch.toLowerCase();
                    return (
                      (s.name || '').toLowerCase().includes(query) ||
                      (s.rollNumber || '').toLowerCase().includes(query) ||
                      (s.schoolName || '').toLowerCase().includes(query) ||
                      (s.grade || s.className || '').toLowerCase().includes(query) ||
                      (s.fatherName || s.parentName || '').toLowerCase().includes(query) ||
                      (s.motherName || '').toLowerCase().includes(query) ||
                      (s.fatherPhone || s.parentWhatsApp || '').includes(query) ||
                      (s.motherPhone || '').includes(query) ||
                      (s.email || s.parentEmail || '').toLowerCase().includes(query)
                    );
                  })
                  .map((s) => {
                    const studentKey = s.id || s._id || s.rollNumber;
                    const father = s.fatherName || s.parentName || 'Rajesh Sharma';
                    const fatherPhone = s.fatherPhone || s.parentWhatsApp || '+919876543210';
                    const mother = s.motherName || 'Parent / Guardian';
                    const motherPhone = s.motherPhone || fatherPhone;
                    const email = s.email || s.parentEmail || 'student@gmail.com';
                    const school = s.schoolName || 'KVS Matriculation Higher Secondary School';
                    const sClass = s.grade || s.className || 'AI & GenAI Master Track';
                    const due = s.dueFees !== undefined ? s.dueFees : Math.max(0, (s.totalFees || 45000) - (s.paidFees || 0));
                    const isCopied = copiedRollId === studentKey;
                    const isPwdVisible = !!showPasswordIds[studentKey];
                    const pwdDisplay = s.password || `${s.rollNumber || 'WG26-001'}@2026`;

                    return (
                      <tr key={studentKey} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.15s ease' }}>
                        {/* Student Name, Username & Login Password */}
                        <td style={{ padding: '14px', minWidth: '220px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                            {s.name}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '6px' }}>
                            {/* Username row */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User:</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '5px',
                                  background: 'rgba(37, 99, 235, 0.15)',
                                  color: 'var(--primary-light)',
                                  fontFamily: 'monospace',
                                  letterSpacing: '0.5px',
                                  border: '1px solid rgba(37, 99, 235, 0.25)',
                                }}
                              >
                                {s.rollNumber || 'WG26-001'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(s.rollNumber || 'WG26-001');
                                  toast.success(`Copied Username: ${s.rollNumber || 'WG26-001'}`, 'Copied');
                                }}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                title="Copy Username / Roll No"
                              >
                                <Copy size={11} />
                              </button>
                            </div>

                            {/* Password row */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pass:</span>
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: 'rgba(242, 106, 27, 0.1)',
                                  padding: '2px 8px',
                                  borderRadius: '5px',
                                  border: '1px solid rgba(242, 106, 27, 0.25)',
                                }}
                              >
                                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: isPwdVisible ? 'var(--brand-orange)' : 'var(--text-muted)', fontWeight: 700 }}>
                                  {isPwdVisible ? pwdDisplay : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(studentKey)}
                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '1px', display: 'flex', alignItems: 'center' }}
                                  title={isPwdVisible ? 'Hide Password' : 'Show Password'}
                                >
                                  {isPwdVisible ? <EyeOff size={11} /> : <Eye size={11} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pwdDisplay);
                                    toast.success(`Copied Password: ${pwdDisplay}`, 'Copied');
                                  }}
                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '1px', display: 'flex', alignItems: 'center' }}
                                  title="Copy Password"
                                >
                                  <Copy size={11} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => copyStudentCredentials(s)}
                                style={{
                                  background: isCopied ? 'rgba(52, 211, 153, 0.15)' : 'var(--bg-glass)',
                                  border: isCopied ? '1px solid #34d399' : '1px solid var(--border-glass)',
                                  color: isCopied ? '#34d399' : 'var(--text-secondary)',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                                title="Copy both Username & Password formatted for sending"
                              >
                                {isCopied ? <Check size={10} /> : <Copy size={10} />}
                                <span>{isCopied ? 'Copied' : 'Both'}</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Class */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sClass}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.batch || 'Cohort Alpha'}</div>
                        </td>

                        {/* School Name */}
                        <td style={{ padding: '14px', maxWidth: '180px' }}>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: 1.3 }}>
                            {school}
                          </div>
                        </td>

                        {/* Father Details */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{father}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>
                            <Phone size={11} />
                            <span>{fatherPhone}</span>
                          </div>
                        </td>

                        {/* Mother Details */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mother}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#38bdf8', marginTop: '2px', fontWeight: 600 }}>
                            <Phone size={11} />
                            <span>{motherPhone}</span>
                          </div>
                        </td>

                        {/* Gmail */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                            <Mail size={12} style={{ color: 'var(--brand-orange)' }} />
                            <span>{email}</span>
                          </div>
                        </td>

                        {/* Fees */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: due > 0 ? '#f59e0b' : '#10b981', fontSize: '12.5px' }}>
                            {due > 0 ? `Due: ₹${due.toLocaleString('en-IN')}` : 'Cleared ✓'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Paid: ₹{(s.paidFees || 0).toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setNotifyingStudent(s);
                                setNotifyChannel('whatsapp');
                                handleApplyDirectTemplate('tmpl_credentials', s);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '5px 8px', fontSize: '11.5px', gap: '4px', color: '#25D366' }}
                              title="Send WhatsApp Notification with Credentials / Fee to Parents"
                            >
                              <MessageCircle size={13} />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={() => {
                                setNotifyingStudent(s);
                                setDirectNotifyTemplateId('');
                                setNotifyChannel('email');
                                setNotifySubject(`Academic Notification for ${s.name} | WeGrow Campus`);
                                setNotifyMessage(`Dear Parents of ${s.name},\n\nPlease review the latest notification from WeGrow Skill Campus regarding curriculum progress.`);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '5px 8px', fontSize: '11.5px', gap: '4px', color: '#38bdf8' }}
                              title="Send Email Notification"
                            >
                              <Mail size={13} />
                              <span>Email</span>
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(s.id || s._id, s.name)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '5px 8px', fontSize: '11.5px', color: '#fb7185' }}
                              title="Remove Student"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: NOTIFICATION TEMPLATES & BULK BROADCAST STUDIO     */}
      {/* ======================================================== */}
      {currentTab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={22} style={{ color: 'var(--brand-orange)' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Notification Templates &amp; Bulk Broadcast Studio
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Create templates with dynamic placeholders and broadcast messages to parents via WhatsApp and Email APIs.
                </p>
              </div>

              <button
                id="btn-admin-add-template"
                onClick={() => setIsNewTemplateModalOpen(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 700 }}
              >
                <Plus size={16} />
                <span>+ Create New Template</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: Saved Notification Templates Library */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Saved Notification Templates</span>
              <span style={{ fontSize: '11px', background: 'rgba(242, 106, 27, 0.15)', color: 'var(--brand-orange)', padding: '2px 8px', borderRadius: '12px' }}>
                {templatesList.length} Active
              </span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {templatesList.map((tpl) => (
                <div
                  key={tpl.id || tpl._id}
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: tpl.category === 'Attendance' ? 'rgba(239, 68, 68, 0.15)' : tpl.category === 'Fees' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                          color: tpl.category === 'Attendance' ? '#ef4444' : tpl.category === 'Fees' ? '#f59e0b' : 'var(--primary-light)',
                        }}
                      >
                        {tpl.category || 'General'}
                      </span>

                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {tpl.channel === 'both' ? 'WhatsApp & Email' : tpl.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                      {tpl.title}
                    </h4>

                    {tpl.subject && (
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                        Subject: <span style={{ color: 'var(--text-secondary)' }}>{tpl.subject}</span>
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: '12.5px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        background: 'rgba(0, 0, 0, 0.2)',
                        padding: '10px',
                        borderRadius: '8px',
                        maxHeight: '110px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {tpl.templateBody}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      onClick={() => {
                        setSelectedTemplateId(tpl.id || tpl._id);
                        if (tpl.subject) setBulkCustomSubject(tpl.subject);
                        setBulkCustomMessage(tpl.templateBody);
                        if (tpl.channel) setBulkChannel(tpl.channel as any);
                        const consoleEl = document.getElementById('bulk-broadcast-form');
                        if (consoleEl) consoleEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '12px', fontWeight: 600 }}
                    >
                      Use in Broadcast ➔
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id || tpl._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px', color: '#fb7185' }}
                      title="Delete Template"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Bulk Message Broadcast Console */}
          <div id="bulk-broadcast-form" className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} style={{ color: 'var(--brand-orange)' }} />
              <span>Bulk Message Broadcast Console</span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              Dispatch formatted notices with personalized student details to parents across chosen cohorts.
            </p>

            {bulkSuccessMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  color: '#34d399',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={20} />
                  <span>{bulkSuccessMsg}</span>
                </div>
                <button
                  onClick={() => setBulkSuccessMsg('')}
                  style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handleSendBulkNotification}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                {/* Target Audience */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    1. Target Student Cohort / Class
                  </label>
                  <select
                    value={bulkTargetBatch}
                    onChange={(e) => setBulkTargetBatch(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', fontSize: '13px' }}
                  >
                    <option value="All Batches">All Enrolled Students &amp; Batches (Full Campus)</option>
                    <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                    <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                    <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
                  </select>
                </div>

                {/* Delivery Channel */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    2. Official Notification Delivery Channel
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setBulkChannel('whatsapp')}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '8px',
                        border: bulkChannel === 'whatsapp' ? '2px solid #25D366' : '1px solid var(--border-glass)',
                        background: bulkChannel === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'var(--bg-glass)',
                        color: bulkChannel === 'whatsapp' ? '#25D366' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBulkChannel('email')}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '8px',
                        border: bulkChannel === 'email' ? '2px solid #38bdf8' : '1px solid var(--border-glass)',
                        background: bulkChannel === 'email' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-glass)',
                        color: bulkChannel === 'email' ? '#38bdf8' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Mail size={15} />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBulkChannel('both')}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '8px',
                        border: bulkChannel === 'both' ? '2px solid var(--brand-orange)' : '1px solid var(--border-glass)',
                        background: bulkChannel === 'both' ? 'rgba(242, 106, 27, 0.15)' : 'var(--bg-glass)',
                        color: bulkChannel === 'both' ? 'var(--brand-orange)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Sparkles size={15} />
                      <span>Both APIs</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Variables Chips */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', marginRight: '8px' }}>
                  Click to Insert Variable Tag:
                </span>
                <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {['{studentName}', '{className}', '{schoolName}', '{fatherName}', '{motherName}', '{date}', '{dueFees}'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setBulkCustomMessage((prev) => prev + ' ' + chip)}
                      style={{
                        background: 'rgba(37, 99, 235, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        color: 'var(--primary-light)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Line */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Notification Subject
                </label>
                <input
                  type="text"
                  value={bulkCustomSubject}
                  onChange={(e) => setBulkCustomSubject(e.target.value)}
                  placeholder="Official Notice from WeGrow Skill Campus..."
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                  required
                />
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Message Content Body (Supports dynamic tags)
                </label>
                <textarea
                  rows={5}
                  value={bulkCustomMessage}
                  onChange={(e) => setBulkCustomMessage(e.target.value)}
                  placeholder="Write message content here..."
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px', lineHeight: 1.5 }}
                  required
                />
              </div>

              {/* Live Preview Card */}
              <div
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px dashed var(--border-glass)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-orange)', marginBottom: '6px' }}>
                  📱 Real-Time Live Parent Preview (Sample: Aarav Sharma)
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {bulkCustomMessage
                    .replace(/{studentName}/g, 'Aarav Sharma')
                    .replace(/{className}/g, 'AI & GenAI Master Track')
                    .replace(/{schoolName}/g, 'KVS Matriculation Higher Secondary School')
                    .replace(/{fatherName}/g, 'Rajesh Sharma')
                    .replace(/{motherName}/g, 'Sunita Sharma')
                    .replace(/{date}/g, new Date().toLocaleDateString('en-IN'))
                    .replace(/{dueFees}/g, '15,000')}
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={bulkSending}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '14.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {bulkSending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Broadcasting via WhatsApp &amp; Email APIs...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Bulk Notification Broadcast to Parents ({bulkTargetBatch})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* SECTION 3: Live Broadcast Dispatch History */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Broadcast Dispatch Log &amp; Delivery Status
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Timestamp</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Target Cohort</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Channel</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Broadcast Subject</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Recipients</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkBroadcastHistory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{item.date}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--primary-light)' }}>{item.target}</td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{item.channel}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{item.title}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.recipientCount} Parents
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          ● {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: REGISTER NEW STUDENT FORM                       */}
      {/* ======================================================== */}
      {isNewStudentModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              animation: 'modal-fade-in 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #F26A1B, #E5530A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Register New Student &amp; Parents
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Enter student name, class, school, father &amp; mother contact numbers, and Gmail.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewStudentModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent}>
              {/* Enrollment ID & Login Password Section */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(242, 106, 27, 0.08), rgba(37, 99, 235, 0.08))',
                  border: '1px solid rgba(242, 106, 27, 0.25)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--brand-orange)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Student Enrollment ID &amp; Portal Password (Created with Admin)
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '20px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    ⚡ Starts WG26-001 (Auto-Increment)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {/* Enrollment ID */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Assigned Enrollment / Roll No *
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await api.getNextEnrollmentNumber();
                            if (res.success && res.nextRollNumber) {
                              setNewStudent((prev) => ({
                                ...prev,
                                rollNumber: res.nextRollNumber,
                                password: `${res.nextRollNumber}@2026`,
                              }));
                            }
                          } catch (e) {
                            // ignore
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--primary-light)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        ↺ Refresh Sequence
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newStudent.rollNumber}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setNewStudent({
                          ...newStudent,
                          rollNumber: val,
                          password: newStudent.password.startsWith('WG26-') ? `${val}@2026` : newStudent.password,
                        });
                      }}
                      placeholder="WG26-001"
                      className="input-field"
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '14px',
                        color: 'var(--brand-orange)',
                        letterSpacing: '0.5px',
                      }}
                    />
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      Backend automatically starts at WG26-001 and increments sequentially.
                    </span>
                  </div>

                  {/* Password Created with Admin */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Student Portal Password (Admin Created) *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setNewStudent((prev) => ({
                            ...prev,
                            password: `${prev.rollNumber || 'WG26-001'}@2026`,
                          }));
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--brand-orange)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Reset to [RollNo]@2026
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      placeholder="WG26-001@2026"
                      className="input-field"
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '13.5px',
                      }}
                    />
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      Student will log in with this password + Enrollment ID (or email).
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* Student Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* School Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.schoolName}
                    onChange={(e) => setNewStudent({ ...newStudent, schoolName: e.target.value })}
                    placeholder="e.g. KVS Matriculation Higher Secondary School"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Class / Track */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Academic Class / Track *
                  </label>
                  <select
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="AI & GenAI Master Track">AI &amp; GenAI Master Track (12-Month Diploma)</option>
                    <option value="Robotics & Embedded AI">Robotics &amp; Embedded AI Track</option>
                    <option value="Python & Creative AI">Python &amp; Creative AI Track</option>
                    <option value="Full Stack & Cloud Architecture">Full Stack &amp; Cloud Architecture</option>
                  </select>
                </div>

                {/* Enrolled Batch */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Assigned Cohort Batch *
                  </label>
                  <select
                    value={newStudent.batch}
                    onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                    <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                    <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
                  </select>
                </div>

                {/* Father Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Father Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Father Phone / WhatsApp */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Father Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStudent.fatherPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Mother Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Mother Name
                  </label>
                  <input
                    type="text"
                    value={newStudent.motherName}
                    onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                    placeholder="e.g. Sunita Sharma"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Mother Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Mother Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={newStudent.motherPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, motherPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43211"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Student / Parent Gmail */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Gmail / Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="e.g. aarav.sharma@gmail.com"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Total Tuition Fee */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Total Course Fee (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 45000"
                    value={newStudent.totalFees === 0 ? '' : newStudent.totalFees}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewStudent({ ...newStudent, totalFees: v === '' ? 0 : Number(v) });
                    }}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Initial Paid Fee */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Initial Paid Fee (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newStudent.paidFees === 0 ? '' : newStudent.paidFees}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewStudent({ ...newStudent, paidFees: v === '' ? 0 : Number(v) });
                    }}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsNewStudentModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={studentCreating}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {studentCreating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Saving Student Record...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={15} />
                      <span>Register &amp; Save Student</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DIRECT NOTIFICATION DISPATCH                    */}
      {/* ======================================================== */}
      {notifyingStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              animation: 'modal-fade-in 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Dispatch Parent Notice: {notifyingStudent.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Roll: {notifyingStudent.rollNumber} &bull; School: {notifyingStudent.schoolName || 'WeGrow Campus'}
                </p>
              </div>

              <button
                onClick={() => setNotifyingStudent(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {notifySuccessMsg && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  color: '#34d399',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle size={16} />
                <span>{notifySuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendDirectNotification}>
              {/* Recipient Details Pill */}
              <div
                style={{
                  background: 'var(--bg-glass)',
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '12.5px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Father Phone:</span>{' '}
                  <strong style={{ color: '#10b981' }}>{notifyingStudent.fatherPhone || notifyingStudent.parentWhatsApp || '+919876543210'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mother Phone:</span>{' '}
                  <strong style={{ color: '#38bdf8' }}>{notifyingStudent.motherPhone || notifyingStudent.fatherPhone || '+919876543211'}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gmail:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{notifyingStudent.email || notifyingStudent.parentEmail || 'student@gmail.com'}</strong>
                </div>
              </div>

              {/* Choose Notification Template */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Choose Message Template
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--brand-orange)', fontWeight: 700 }}>
                    ⚡ Auto-fills message &amp; channel
                  </span>
                </div>

                {/* Quick Selection Template Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleApplyDirectTemplate('tmpl_credentials')}
                    style={{
                      fontSize: '11px',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      border: directNotifyTemplateId === 'tmpl_credentials' ? '1.5px solid var(--brand-orange)' : '1px solid var(--border-glass)',
                      background: directNotifyTemplateId === 'tmpl_credentials' ? 'rgba(242, 106, 27, 0.15)' : 'var(--bg-glass)',
                      color: directNotifyTemplateId === 'tmpl_credentials' ? 'var(--brand-orange)' : 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>🔑 Student Credentials (User &amp; Pass)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDirectTemplate('tmpl_fee_receipt')}
                    style={{
                      fontSize: '11px',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      border: directNotifyTemplateId === 'tmpl_fee_receipt' ? '1.5px solid #10b981' : '1px solid var(--border-glass)',
                      background: directNotifyTemplateId === 'tmpl_fee_receipt' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-glass)',
                      color: directNotifyTemplateId === 'tmpl_fee_receipt' ? '#10b981' : 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>💳 Fee Receipt &amp; Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDirectTemplate('tmpl_02')}
                    style={{
                      fontSize: '11px',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      border: directNotifyTemplateId === 'tmpl_02' ? '1.5px solid #38bdf8' : '1px solid var(--border-glass)',
                      background: directNotifyTemplateId === 'tmpl_02' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-glass)',
                      color: directNotifyTemplateId === 'tmpl_02' ? '#38bdf8' : 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>⏳ Fee Due Alert</span>
                  </button>
                </div>

                <select
                  value={directNotifyTemplateId}
                  onChange={(e) => handleApplyDirectTemplate(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  <option value="">-- Choose Template to Auto-fill Message --</option>
                  {templatesList.map((tmpl) => (
                    <option key={tmpl.id || tmpl._id} value={tmpl.id || tmpl._id}>
                      [{tmpl.category}] {tmpl.title} ({String(tmpl.channel).toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Notification Channel
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setNotifyChannel('whatsapp')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: notifyChannel === 'whatsapp' ? '2px solid #25D366' : '1px solid var(--border-glass)',
                      background: notifyChannel === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'transparent',
                      color: notifyChannel === 'whatsapp' ? '#25D366' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    WhatsApp API
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifyChannel('email')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: notifyChannel === 'email' ? '2px solid #38bdf8' : '1px solid var(--border-glass)',
                      background: notifyChannel === 'email' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      color: notifyChannel === 'email' ? '#38bdf8' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Email API
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifyChannel('both')}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: notifyChannel === 'both' ? '2px solid var(--brand-orange)' : '1px solid var(--border-glass)',
                      background: notifyChannel === 'both' ? 'rgba(242, 106, 27, 0.15)' : 'transparent',
                      color: notifyChannel === 'both' ? 'var(--brand-orange)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Both APIs
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={notifySubject}
                  onChange={(e) => setNotifySubject(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13px' }}
                  required
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Message Content
                </label>
                <textarea
                  rows={6}
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13px', lineHeight: 1.5 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setNotifyingStudent(null)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>

                {/* Direct WhatsApp Web / App Link */}
                <button
                  type="button"
                  onClick={() => {
                    const rawPhone = notifyingStudent.fatherPhone || notifyingStudent.parentWhatsApp || notifyingStudent.motherPhone || '';
                    const cleanPhone = rawPhone.replace(/[^\d]/g, '');
                    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone);
                    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(notifyMessage)}`;
                    window.open(waUrl, '_blank');
                  }}
                  className="btn"
                  style={{
                    padding: '8px 16px',
                    fontWeight: 700,
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                  }}
                  title="Open chat in WhatsApp Web or Mobile App"
                >
                  <MessageCircle size={15} />
                  <span>Open in WhatsApp</span>
                </button>

                <button
                  type="submit"
                  disabled={notifySending}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {notifySending ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Sending Notice...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send to Parents</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CREATE NOTIFICATION TEMPLATE                    */}
      {/* ======================================================== */}
      {isNewTemplateModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '580px',
              padding: '26px',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              animation: 'modal-fade-in 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Create New Notification Template
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Define dynamic message variables for attendance, fees, exams, or notices.
                </p>
              </div>

              <button
                onClick={() => setIsNewTemplateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate}>
              {/* Template Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Lab Exam Schedule"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="Attendance">Attendance</option>
                    <option value="Fees">Fees &amp; Payments</option>
                    <option value="Academic">Academic &amp; Results</option>
                    <option value="PTM">PTM Conference</option>
                    <option value="Notice">General Notice</option>
                  </select>
                </div>

                {/* Channel */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Delivery Channel
                  </label>
                  <select
                    value={newTemplate.channel}
                    onChange={(e) => setNewTemplate({ ...newTemplate, channel: e.target.value })}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="both">Both (WhatsApp &amp; Email)</option>
                    <option value="whatsapp">WhatsApp Only</option>
                    <option value="email">Email Only</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email Subject Line
                </label>
                <input
                  type="text"
                  placeholder="e.g. Notice Regarding {studentName} - WeGrow Campus"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Variable Chips */}
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginRight: '6px' }}>
                  Click to Insert Tag:
                </span>
                <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {['{studentName}', '{className}', '{schoolName}', '{fatherName}', '{motherName}', '{date}', '{dueFees}'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setNewTemplate((prev) => ({ ...prev, templateBody: prev.templateBody + ' ' + chip }))}
                      style={{
                        background: 'rgba(242, 106, 27, 0.12)',
                        border: '1px solid rgba(242, 106, 27, 0.3)',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        color: 'var(--brand-orange)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Body */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Template Message Body *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Dear {fatherName} & {motherName}, this is an update regarding {studentName}..."
                  value={newTemplate.templateBody}
                  onChange={(e) => setNewTemplate({ ...newTemplate, templateBody: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13px', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsNewTemplateModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={templateCreating}
                  className="btn btn-primary"
                  style={{ padding: '8px 22px', fontWeight: 700 }}
                >
                  {templateCreating ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
