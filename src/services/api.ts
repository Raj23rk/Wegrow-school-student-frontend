const API_BASE = '/api';

const SESSION_TOKEN_KEY = 'edupulse_token';
const SESSION_USER_KEY = 'edupulse_user';

export function getAuthToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function hasActiveSession(): boolean {
  return !!getAuthToken();
}

export function setAuthToken(token: string) {
  try {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    // Explicitly purge localStorage to ensure closing window terminates session
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
  } catch (err) {
    console.warn('Could not save session token to sessionStorage:', err);
  }
}

export function clearAuthSession() {
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
  } catch (err) {
    console.warn('Could not clear session storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('auth:session_closed', {
        detail: { reason: 'Session ended or window closed' },
      })
    );
  }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearAuthSession();
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => request('/auth/me'),
  updateProfile: (profileData: any) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  uploadAvatar: (avatarDataUrl: string) =>
    request('/auth/upload-avatar', { method: 'POST', body: JSON.stringify({ avatar: avatarDataUrl }) }),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats'),

  // Syllabus
  getSyllabus: () => request('/syllabus'),
  getSyllabusById: (id: string) => request(`/syllabus/${id}`),

  // Videos
  getVideos: (subject?: string) =>
    request(`/videos${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`),

  // Quizzes & Tasks
  getQuizzes: () => request('/quizzes'),
  getQuizById: (id: string) => request(`/quizzes/${id}`),
  submitQuiz: (id: string, payload: { studentId: string; answers: Record<string, number>; timeSpentSeconds: number }) =>
    request(`/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  createQuiz: (payload: any) =>
    request('/quizzes/admin/create', { method: 'POST', body: JSON.stringify(payload) }),
  deleteQuiz: (id: string) =>
    request(`/quizzes/${id}`, { method: 'DELETE' }),
  getStudentResults: () => request('/quizzes/student/results'),

  // Course Materials
  getMaterials: (subject?: string) =>
    request(`/materials${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`),
  createMaterial: (payload: any) =>
    request('/materials', { method: 'POST', body: JSON.stringify(payload) }),

  // Assignments
  getAssignments: () => request('/assignments'),
  submitAssignment: (id: string, payload: { content: string; attachmentUrl?: string }) =>
    request(`/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteAssignment: (id: string) =>
    request(`/assignments/${id}`, { method: 'DELETE' }),

  // Payments & Razorpay
  getPaymentHistory: () => request('/payments/history'),
  createRazorpayOrder: (payload: { amount?: number; feeType?: string }) =>
    request('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyRazorpayPayment: (payload: any) =>
    request('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin Endpoints
  getAdminOverview: () => request('/admin/overview'),
  getAdminStudents: (batch?: string) =>
    request(`/admin/students${batch ? `?batch=${encodeURIComponent(batch)}` : ''}`),
  getBatchAttendance: (batch?: string, date?: string) =>
    request(`/admin/attendance?batch=${encodeURIComponent(batch || '')}&date=${encodeURIComponent(date || '')}`),
  markBatchAttendance: (payload: { batch: string; date: string; records: any[] }) =>
    request('/admin/attendance/mark', { method: 'POST', body: JSON.stringify(payload) }),
  broadcastWhatsApp: (payload: {
    targetBatch?: string;
    studentId?: string;
    messageType?: string;
    customMessage?: string;
  }) => request('/admin/broadcast-whatsapp', { method: 'POST', body: JSON.stringify(payload) }),
  recordAdminPayment: (payload: {
    studentId: string;
    amount: number;
    paymentMethod: string;
    feeType: string;
    referenceNumber?: string;
  }) => request('/admin/record-payment', { method: 'POST', body: JSON.stringify(payload) }),
  createAssignment: (payload: any) =>
    request('/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  createVideo: (payload: any) =>
    request('/videos', { method: 'POST', body: JSON.stringify(payload) }),

  // Student Admissions & Management
  getNextEnrollmentNumber: () =>
    request<{ success: boolean; nextRollNumber: string; defaultPassword: string }>('/admin/next-enrollment'),
  resetStudents: () =>
    request<{ success: boolean; message: string; nextRollNumber: string; defaultPassword: string }>('/admin/reset-students', { method: 'POST' }),
  loadSampleStudents: () =>
    request<{ success: boolean; message: string; count: number; nextRollNumber: string; defaultPassword: string }>('/admin/load-sample-students', { method: 'POST' }),
  createStudent: (payload: any) =>
    request('/admin/students', { method: 'POST', body: JSON.stringify(payload) }),
  deleteStudent: (id: string) =>
    request(`/admin/students/${id}`, { method: 'DELETE' }),
  notifyStudent: (id: string, payload: { channel?: string; customMessage?: string; subject?: string }) =>
    request(`/admin/students/${id}/notify`, { method: 'POST', body: JSON.stringify(payload) }),

  // Notification Templates & Bulk Dispatch
  getNotificationTemplates: () =>
    request('/admin/notification-templates'),
  createNotificationTemplate: (payload: { title: string; category?: string; channel?: string; subject?: string; templateBody: string }) =>
    request('/admin/notification-templates', { method: 'POST', body: JSON.stringify(payload) }),
  deleteNotificationTemplate: (id: string) =>
    request(`/admin/notification-templates/${id}`, { method: 'DELETE' }),
  broadcastNotification: (payload: { channel: string; targetBatch?: string; templateId?: string; customSubject?: string; customMessage?: string }) =>
    request('/admin/broadcast-notification', { method: 'POST', body: JSON.stringify(payload) }),

  // V1 WhatsApp Template API (Meta Verified)
  sendWhatsAppNotification: (payload: {
    contact: string;
    template: string;
    params?: string[];
    name?: string;
    fileUrl?: string;
    pdfName?: string;
  }) => request('/v1/notifications/whatsapp', { method: 'POST', body: JSON.stringify(payload) }),
};

