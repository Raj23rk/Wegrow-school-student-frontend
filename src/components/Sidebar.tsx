import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileQuestion,
  BookMarked,
  ClipboardList,
  CreditCard,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  MessageCircle,
  Users,
  Bell,
} from 'lucide-react';
import { Student } from '../types';

export type TabType =
  | 'dashboard'
  | 'syllabus'
  | 'videos'
  | 'quizzes'
  | 'materials'
  | 'assignments'
  | 'payments'
  | 'profile'
  | 'admin'
  | 'admin-students'
  | 'admin-attendance'
  | 'admin-quizzes'
  | 'admin-assignments'
  | 'admin-videos'
  | 'admin-notes'
  | 'admin-finance'
  | 'admin-whatsapp'
  | 'admin-templates';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  student: Student | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  ongoingClassCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  student,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  ongoingClassCount = 0,
}) => {
  const isAdmin = student?.role === 'admin' || currentTab.startsWith('admin') || student?.email?.includes('kumar') || student?.email?.includes('admin');

  const adminNavItems: { id: TabType; label: string; icon: any }[] = [
    {
      id: 'admin',
      label: 'Control Center Hub',
      icon: ShieldCheck,
    },
    {
      id: 'admin-students',
      label: 'Student Admissions',
      icon: Users,
    },
    {
      id: 'admin-attendance',
      label: 'Batch Attendance',
      icon: CalendarCheck,
    },
    {
      id: 'admin-quizzes',
      label: 'Upload Quizzes',
      icon: FileQuestion,
    },
    {
      id: 'admin-assignments',
      label: 'Upload Assignments',
      icon: ClipboardList,
    },
    {
      id: 'admin-videos',
      label: 'Upload Video Lectures',
      icon: Video,
    },
    {
      id: 'admin-notes',
      label: 'Publish Daily Notes',
      icon: BookMarked,
    },
    {
      id: 'admin-finance',
      label: 'Fee & Invoices',
      icon: CreditCard,
    },
    {
      id: 'admin-whatsapp',
      label: 'Parent WhatsApp Alerts',
      icon: MessageCircle,
    },
    {
      id: 'admin-templates',
      label: 'Notification Templates',
      icon: Bell,
    },
  ];

  const studentNavItems: { id: TabType; label: string; icon: any }[] = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'syllabus',
      label: 'Syllabus',
      icon: BookOpen,
    },
    {
      id: 'videos',
      label: 'Video Lectures',
      icon: Video,
    },
    {
      id: 'quizzes',
      label: 'Tasks & Quizzes',
      icon: FileQuestion,
    },
    {
      id: 'materials',
      label: 'Course Material & Notes',
      icon: BookMarked,
    },
    {
      id: 'assignments',
      label: 'Assignment Tasks',
      icon: ClipboardList,
    },
    {
      id: 'payments',
      label: 'Fee Payments',
      icon: CreditCard,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
    },
  ];

  const handleNavClick = (tab: TabType) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {isOpenMobile && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
      <aside className={`app-sidebar ${isOpenMobile ? 'open' : ''}`}>
        {/* Brand Logo Header */}
        <div className="sidebar-logo" style={{ padding: '0 18px', display: 'flex', alignItems: 'center' }}>
          <div className="brand-logo-container">
            <img
              src="/wegrow-logo.webp"
              alt="WeGrow Skill Campus & B School"
              style={{
                width: '100%',
                maxHeight: '44px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {/* Admin Operations Section if User is Admin */}
          {isAdmin && (
            <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border-glass)' }}>
              <div
                style={{
                  padding: '0 8px 6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--brand-orange)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={13} /> Admin Operations
                </span>
                <span style={{ fontSize: '9.5px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>
                  FULL ACCESS
                </span>
              </div>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      textAlign: 'left',
                      background: isActive ? undefined : 'transparent',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? 'var(--primary-light)' : '#f59e0b', flexShrink: 0 }} />
                    <span style={{ fontWeight: isActive ? 800 : 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Student Portal Navigation - Shown only to students */}
          {!isAdmin && (
            <>
              <div
                style={{
                  padding: '0 8px 6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Academic Portal
              </div>
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    style={{ textAlign: 'left', background: isActive ? undefined : 'transparent', width: '100%' }}
                  >
                    <Icon size={18} style={{ color: isActive ? 'var(--primary-light)' : 'var(--text-muted)' }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Student Mini Profile Footer */}
        {student && (
          <div className="sidebar-footer">
            <div style={{ position: 'relative' }}>
              <img
                src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={student.name}
                className="avatar-sm"
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid var(--bg-secondary)',
                }}
              />
            </div>
            <div className="sidebar-user-info" onClick={() => handleNavClick('profile')} style={{ cursor: 'pointer' }}>
              <div className="sidebar-user-name">{student.name}</div>
              <div className="sidebar-user-role">{student.rollNumber} • {student.grade}</div>
            </div>
            <button
              id="btn-sidebar-logout"
              onClick={onLogout}
              className="btn-icon"
              title="Logout session"
              style={{ flexShrink: 0 }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
