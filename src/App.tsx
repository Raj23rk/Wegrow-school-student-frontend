import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationToast } from './components/NotificationToast';
import { Dashboard } from './pages/Dashboard';
import { Syllabus } from './pages/Syllabus';
import { Videos } from './pages/Videos';
import { Quizzes } from './pages/Quizzes';
import { CourseMaterials } from './pages/CourseMaterials';
import { Assignments } from './pages/Assignments';
import { FeesPayments } from './pages/FeesPayments';
import { Profile } from './pages/Profile';
import { AdminControlCenter, AdminTab } from './pages/AdminControlCenter';
import { LandingPage } from './landing/LandingPage';
import { StudentLoginView } from './landing/StudentLoginView';
import { Student } from './types';
import { api, clearAuthSession, getAuthToken, setAuthToken } from './services/api';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileQuestion,
  BookMarked,
  CreditCard,
  User,
  ShieldCheck,
  CalendarCheck,
  FileText,
  MessageCircle,
  Users,
  Bell,
} from 'lucide-react';

export function App() {
  const [student, setStudent] = useState<Student | null>(null);
  const [publicView, setPublicView] = useState<'landing' | 'login'>('landing');
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [ongoingCount, setOngoingCount] = useState(1);
  const [activeNotification, setActiveNotification] = useState<any | null>(null);

  // Check token and session on startup
  useEffect(() => {
    // 1. Purge persistent localStorage tokens to guarantee sessions close when window closes
    try {
      localStorage.removeItem('edupulse_token');
      localStorage.removeItem('edupulse_user');
    } catch {
      // ignore
    }

    checkSession();

    // 2. Global event listener: when session is closed or expired, automatically close portal
    const handleSessionClosed = () => {
      setStudent(null);
      setPublicView('landing');
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    // 3. Hash change listener: handles direct navigation, #admin, and tab synchronization
    const handleHashChange = () => {
      const rawHash = window.location.hash.toLowerCase().replace(/^#/, '');
      if (!rawHash) return;

      if (rawHash === 'login') {
        setPublicView('login');
        return;
      }

      // Check if user is navigating to admin route (#admin or #admin-*)
      if (rawHash === 'admin' || rawHash.startsWith('admin-')) {
        const token = getAuthToken();
        if (!token) {
          setPublicView('login');
          return;
        }
        const validAdminTabs: TabType[] = [
          'admin',
          'admin-students',
          'admin-attendance',
          'admin-quizzes',
          'admin-assignments',
          'admin-videos',
          'admin-notes',
          'admin-finance',
          'admin-whatsapp',
          'admin-templates',
        ];
        if (validAdminTabs.includes(rawHash as TabType)) {
          setCurrentTab(rawHash as TabType);
        } else {
          setCurrentTab('admin');
        }
        return;
      }

      // Check student portal tabs
      const validStudentTabs: TabType[] = [
        'dashboard',
        'syllabus',
        'videos',
        'quizzes',
        'materials',
        'assignments',
        'payments',
        'profile',
      ];
      if (validStudentTabs.includes(rawHash as TabType)) {
        const token = getAuthToken();
        if (!token) {
          setPublicView('login');
          return;
        }
        setCurrentTab(rawHash as TabType);
      }
    };

    window.addEventListener('auth:session_closed', handleSessionClosed);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('auth:session_closed', handleSessionClosed);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle smooth scroll when navigating to anchor hashes on landing page
  useEffect(() => {
    if (!loadingInitial && !student) {
      const hash = window.location.hash;
      if (hash && hash !== '#login' && hash !== '#admin' && !hash.startsWith('#admin-')) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120);
        }
      }
    }
  }, [loadingInitial, student, publicView]);

  const checkSession = async () => {
    const rawHash = window.location.hash.toLowerCase().replace(/^#/, '');

    // 1. Capture token passed via URL parameter if any
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    if (!token && window.location.hash && window.location.hash.includes('token=')) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      token = hashParams.get('token');
    }

    if (token) {
      setAuthToken(token);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      token = getAuthToken();
    }

    // If no active session token exists in sessionStorage:
    if (!token) {
      setStudent(null);
      if (rawHash === 'login' || rawHash === 'admin' || rawHash.startsWith('admin')) {
        setPublicView('login');
      } else {
        setPublicView('landing');
      }
      setLoadingInitial(false);
      return;
    }

    // 2. Validate session with backend API
    try {
      const res = await api.getProfile();
      if (res && res.student) {
        setStudent(res.student);
        const isAdmin = res.student.role === 'admin';

        if (rawHash === 'admin' || rawHash.startsWith('admin-')) {
          if (isAdmin) {
            const validAdminTabs: TabType[] = [
              'admin',
              'admin-students',
              'admin-attendance',
              'admin-quizzes',
              'admin-assignments',
              'admin-videos',
              'admin-notes',
              'admin-finance',
              'admin-whatsapp',
              'admin-templates',
            ];
            setCurrentTab(validAdminTabs.includes(rawHash as TabType) ? (rawHash as TabType) : 'admin');
          } else {
            setCurrentTab('dashboard');
            window.location.hash = 'dashboard';
          }
        } else if (
          [
            'dashboard',
            'syllabus',
            'videos',
            'quizzes',
            'materials',
            'assignments',
            'payments',
            'profile',
          ].includes(rawHash)
        ) {
          setCurrentTab(rawHash as TabType);
        } else if (isAdmin) {
          setCurrentTab('admin');
          window.location.hash = 'admin';
        } else {
          setCurrentTab('dashboard');
          window.location.hash = 'dashboard';
        }
      } else {
        throw new Error('Invalid student session');
      }
    } catch {
      clearAuthSession();
      setStudent(null);
      if (rawHash === 'login' || rawHash === 'admin' || rawHash.startsWith('admin')) {
        setPublicView('login');
      } else {
        setPublicView('landing');
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleLoginSuccess = (loggedInStudent: Student) => {
    setStudent(loggedInStudent);
    const rawHash = window.location.hash.toLowerCase().replace(/^#/, '');

    if (loggedInStudent.role === 'admin') {
      const target = rawHash.startsWith('admin') ? (rawHash as TabType) : 'admin';
      setCurrentTab(target);
      window.location.hash = target;
    } else {
      const target = ['dashboard', 'syllabus', 'videos', 'quizzes', 'materials', 'assignments', 'payments', 'profile'].includes(rawHash)
        ? (rawHash as TabType)
        : 'dashboard';
      setCurrentTab(target);
      window.location.hash = target;
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setStudent(null);
    setPublicView('landing');
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  };

  const handleNotificationSent = (payload: any) => {
    setActiveNotification(payload);
  };

  // While checking initial token
  if (loadingInitial) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#FFF8EF',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="/wegrow-logo.webp"
            alt="WeGrow Skill Campus & B School"
            width={180}
            height={48}
            style={{
              height: '48px',
              width: 'auto',
              margin: '0 auto 18px',
              display: 'block',
              objectFit: 'contain',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo copy.png';
            }}
          />
          <div
            className="pulse-indicator"
            style={{
              width: '20px',
              height: '20px',
              margin: '0 auto 16px',
              background: '#F26A1B',
            }}
          />
          <p style={{ color: '#0B1F4D', fontSize: '15px', fontWeight: 700 }}>
            Loading WeGrow Skill Campus &amp; B School...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in or no active session: Student portal is automatically closed; show Landing Page or Login View
  if (!student || !getAuthToken()) {
    if (publicView === 'login') {
      return (
        <StudentLoginView
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => {
            setPublicView('landing');
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }}
        />
      );
    }

    // Default view when running project: Student Landing Page
    return <LandingPage onOpenLogin={() => setPublicView('login')} />;
  }

  // Authenticated Student: Show Student Dashboard & Academic Portal
  return (
    <div className="app-container">
      {/* Toast Alert for Parent WhatsApp & Email Alerts */}
      <NotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />

      {/* Modern Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.location.hash = tab;
        }}
        student={student}
        onLogout={handleLogout}
        isOpenMobile={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
        ongoingClassCount={ongoingCount}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          onToggleMobile={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          student={student}
          onOpenProfile={() => {
            setCurrentTab('profile');
            window.location.hash = 'profile';
          }}
          onLogout={handleLogout}
        />

        <main className="page-body">
          {/* Admin Operations Control Center */}
          {currentTab.startsWith('admin') && (
            <AdminControlCenter
              onNotificationSent={handleNotificationSent}
              activeSubTab={
                currentTab === 'admin-students'
                  ? 'students'
                  : currentTab === 'admin-templates'
                  ? 'templates'
                  : currentTab === 'admin-attendance'
                  ? 'attendance'
                  : currentTab === 'admin-quizzes'
                  ? 'quizzes'
                  : currentTab === 'admin-assignments'
                  ? 'assignments'
                  : currentTab === 'admin-videos'
                  ? 'videos'
                  : currentTab === 'admin-notes'
                  ? 'notes'
                  : currentTab === 'admin-whatsapp'
                  ? 'whatsapp'
                  : currentTab === 'admin-finance'
                  ? 'finance'
                  : 'overview'
              }
              onSelectSubTab={(sub: AdminTab) => {
                const target = sub === 'overview' ? 'admin' : (`admin-${sub}` as TabType);
                setCurrentTab(target);
                window.location.hash = target;
              }}
            />
          )}

          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={(tab) => {
                setCurrentTab(tab as any);
                window.location.hash = tab;
              }}
            />
          )}
          {currentTab === 'syllabus' && <Syllabus student={student} />}
          {currentTab === 'videos' && <Videos />}
          {currentTab === 'quizzes' && (
            <Quizzes student={student} onNotificationSent={handleNotificationSent} />
          )}
          {currentTab === 'materials' && <CourseMaterials student={student} />}
          {currentTab === 'assignments' && <Assignments />}
          {currentTab === 'payments' && (
            <FeesPayments student={student} onRefreshStudent={checkSession} />
          )}
          {currentTab === 'profile' && (
            <Profile
              student={student}
              onUpdateSuccess={(up) => setStudent(up)}
              onNotificationSent={handleNotificationSent}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for Smart Devices */}
      <nav className="mobile-bottom-bar">
        {student?.role === 'admin' ? (
          <>
            <div
              className={`mobile-bar-item ${currentTab === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin')}
            >
              <ShieldCheck size={18} />
              <span>Hub</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'admin-students' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-students')}
            >
              <Users size={18} />
              <span>Students</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'admin-templates' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-templates')}
            >
              <Bell size={18} />
              <span>Broadcast</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'admin-attendance' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-attendance')}
            >
              <CalendarCheck size={18} />
              <span>Attendance</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'admin-finance' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin-finance')}
            >
              <CreditCard size={18} />
              <span>Finance</span>
            </div>
          </>
        ) : (
          <>
            <div
              className={`mobile-bar-item ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Home</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setCurrentTab('syllabus')}
            >
              <BookOpen size={18} />
              <span>Syllabus</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setCurrentTab('quizzes')}
            >
              <FileQuestion size={18} />
              <span>Tasks</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'payments' ? 'active' : ''}`}
              onClick={() => setCurrentTab('payments')}
            >
              <CreditCard size={18} />
              <span>Fees</span>
            </div>
            <div
              className={`mobile-bar-item ${currentTab === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentTab('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
