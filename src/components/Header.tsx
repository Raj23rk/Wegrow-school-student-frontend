import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Moon, Sparkles, User, LogOut, ChevronDown } from 'lucide-react';
import { Student } from '../types';

interface HeaderProps {
  onToggleMobile: () => void;
  student: Student | null;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobile,
  student,
  onOpenProfile,
  onLogout,
}) => {
  const [currentTheme, setCurrentTheme] = useState<'wegrow' | 'midnight' | 'light'>('wegrow');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const applyTheme = (theme: 'wegrow' | 'midnight' | 'light') => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wegrow_theme_v2', theme);
  };

  useEffect(() => {
    const saved = localStorage.getItem('wegrow_theme_v2') as any;
    if (saved && (saved === 'wegrow' || saved === 'midnight' || saved === 'light')) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      setCurrentTheme('wegrow');
      document.documentElement.setAttribute('data-theme', 'wegrow');
      localStorage.setItem('wegrow_theme_v2', 'wegrow');
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayName = (name?: string) => {
    if (!name) return student?.role === 'admin' ? 'Director' : 'Student';
    if (name.includes('Campus Director') || name === 'Campus Director & Administrator') return 'Director';
    if (name.startsWith('Dr.')) return name.split(' ').slice(0, 2).join(' ');
    return name.split(' ')[0];
  };

  const firstName = getDisplayName(student?.name);

  return (
    <header className="top-header">
      {/* Left side: Hamburger menu + Single-line Welcome text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
        <button
          id="btn-mobile-menu"
          className="btn-icon mobile-nav-toggle"
          onClick={onToggleMobile}
          aria-label="Open navigation menu"
          style={{ flexShrink: 0 }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
          <div
            style={{
              fontSize: 'clamp(14px, 3.8vw, 16px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.2,
            }}
          >
            Welcome, <span style={{ color: 'var(--primary-light)' }}>{firstName}</span>! 👋
          </div>
        </div>
      </div>

      {/* Right side: Profile Avatar Button with Dropdown Menu (Theme switcher inside dropdown) */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {student && (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              id="btn-profile-dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: dropdownOpen ? 'var(--bg-glass)' : 'transparent',
                border: '1px solid',
                borderColor: dropdownOpen ? 'var(--border-focus)' : 'transparent',
                borderRadius: '30px',
                cursor: 'pointer',
                padding: '4px 6px 4px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              aria-label="Profile and Theme settings"
            >
              {/* Avatar with Active Green Badge Dot */}
              <div style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}>
                <img
                  src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={student.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2px solid var(--primary)',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Active Indicator Pulse Dot */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid var(--bg-primary)',
                    boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)',
                  }}
                  title="Status: Active"
                />
              </div>

              {/* Student Name & Active Text (Desktop Only) */}
              <div className="header-profile-text-desktop" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {student.name}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                  <span>Active</span>
                </div>
              </div>

              <ChevronDown
                size={14}
                className="header-profile-text-desktop"
                style={{
                  color: 'var(--text-muted)',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '280px',
                  maxWidth: 'calc(100vw - 24px)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)',
                  padding: '12px',
                  zIndex: 1000,
                  backdropFilter: 'blur(16px)',
                  animation: 'modal-fade-in 0.15s ease-out',
                }}
              >
                {/* User Info Header */}
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--bg-glass)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <img
                    src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={student.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: '2px solid var(--primary)',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {student.email}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        padding: '1px 8px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.18)',
                        color: '#34d399',
                        fontSize: '10.5px',
                        fontWeight: 700,
                      }}
                    >
                      ● {student.role === 'admin' ? 'Administrator' : 'Active Student'}
                    </span>
                  </div>
                </div>

                {/* THEME & APPEARANCE SELECTOR (Dark / Light / Midnight) */}
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      color: 'var(--text-muted)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Appearance &amp; Theme</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--primary-light)', fontWeight: 800 }}>
                      {currentTheme === 'wegrow' ? 'Dark Mode' : currentTheme === 'light' ? 'Light Mode' : 'Midnight'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    <button
                      type="button"
                      id="theme-select-wegrow"
                      onClick={() => applyTheme('wegrow')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: currentTheme === 'wegrow' ? '2px solid #f97316' : '1px solid var(--border-glass)',
                        background: currentTheme === 'wegrow' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                        color: currentTheme === 'wegrow' ? '#f97316' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Sparkles size={16} />
                      <span>Dark</span>
                    </button>

                    <button
                      type="button"
                      id="theme-select-light"
                      onClick={() => applyTheme('light')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: currentTheme === 'light' ? '2px solid #ea580c' : '1px solid var(--border-glass)',
                        background: currentTheme === 'light' ? 'rgba(234, 88, 12, 0.15)' : 'transparent',
                        color: currentTheme === 'light' ? '#ea580c' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Sun size={16} />
                      <span>Light</span>
                    </button>

                    <button
                      type="button"
                      id="theme-select-midnight"
                      onClick={() => applyTheme('midnight')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: currentTheme === 'midnight' ? '2px solid #38bdf8' : '1px solid var(--border-glass)',
                        background: currentTheme === 'midnight' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        color: currentTheme === 'midnight' ? '#38bdf8' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Moon size={16} />
                      <span>Midnight</span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Action Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    id="btn-dropdown-my-profile"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenProfile();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-glass)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <User size={16} style={{ color: 'var(--primary-light)' }} />
                    <span>My Profile</span>
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '4px 0' }} />

                  <button
                    id="btn-dropdown-logout"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#fb7185',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
