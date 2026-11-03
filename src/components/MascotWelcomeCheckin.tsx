import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Clock,
  CalendarCheck,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { Student, DailyAttendanceStatus, AttendanceHoursSummary } from '../types';
import { api } from '../services/api';

interface MascotWelcomeCheckinProps {
  student: Student | null;
  onAttendanceUpdated?: (status: DailyAttendanceStatus) => void;
}

export const MascotWelcomeCheckin: React.FC<MascotWelcomeCheckinProps> = ({
  student,
  onAttendanceUpdated,
}) => {
  const [status, setStatus] = useState<DailyAttendanceStatus>({
    hasCheckedIn: false,
    hasCheckedOut: false,
    todayHours: 0,
    status: 'loading',
  });
  const [weeklyStats, setWeeklyStats] = useState<{ totalHoursWeek: number; daysPresentWeek: number }>({
    totalHoursWeek: 0,
    daysPresentWeek: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState<{ totalHoursMonth: number; daysPresentMonth: number }>({
    totalHoursMonth: 0,
    daysPresentMonth: 0,
  });
  const [loading, setLoading] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mascotMood, setMascotMood] = useState<'wave' | 'celebrate' | 'focus' | 'rest'>('wave');

  // Current live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial student attendance status
  useEffect(() => {
    if (student) {
      loadAttendance();
    }
  }, [student?.id, student?.rollNumber]);

  // Live timer tick when checked in & not checked out
  useEffect(() => {
    let timer: any;
    if (status.hasCheckedIn && !status.hasCheckedOut) {
      timer = setInterval(() => {
        setLiveSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status.hasCheckedIn, status.hasCheckedOut]);

  const loadAttendance = async () => {
    try {
      const res = await api.getStudentAttendanceStatus(student?.id || student?.rollNumber);
      if (res && res.success) {
        setStatus(res.todayStats);
        if (res.weeklyStats) {
          setWeeklyStats({
            totalHoursWeek: res.weeklyStats.totalHoursWeek || 0,
            daysPresentWeek: res.weeklyStats.daysPresentWeek || 0,
          });
        }
        if (res.monthlyStats) {
          setMonthlyStats({
            totalHoursMonth: res.monthlyStats.totalHoursMonth || 0,
            daysPresentMonth: res.monthlyStats.daysPresentMonth || 0,
          });
        }

        // Initialize live counter if checked in today
        if (res.todayStats.hasCheckedIn && !res.todayStats.hasCheckedOut) {
          const activeSec = (res.todayStats.activeMinutes || 0) * 60;
          setLiveSeconds(activeSec > 0 ? activeSec : 120);
          setMascotMood('focus');
        } else if (res.todayStats.hasCheckedOut) {
          setMascotMood('rest');
        } else {
          setMascotMood('wave');
        }

        if (onAttendanceUpdated) {
          onAttendanceUpdated(res.todayStats);
        }
      }
    } catch (err) {
      console.warn('Failed to load student attendance status:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = student?.name ? student.name.split(' ')[0] : 'Explorer';

  const handleCheckIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Fire festive celebration confetti!
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F26A1B', '#FFC21A', '#00E5FF', '#10B981'],
      });

      const res = await api.checkIn({
        studentId: student?.id,
        studentName: student?.name,
        rollNumber: student?.rollNumber,
        batch: (student as any)?.batch,
      });

      if (res && res.success) {
        setStatus(res.todayStats);
        if (res.weeklyStats) {
          setWeeklyStats({
            totalHoursWeek: res.weeklyStats.totalHoursWeek,
            daysPresentWeek: res.weeklyStats.daysPresentWeek,
          });
        }
        if (res.monthlyStats) {
          setMonthlyStats({
            totalHoursMonth: res.monthlyStats.totalHoursMonth,
            daysPresentMonth: res.monthlyStats.daysPresentMonth,
          });
        }
        setLiveSeconds(1);
        setMascotMood('celebrate');
        setTimeout(() => setMascotMood('focus'), 4000);

        if (onAttendanceUpdated) {
          onAttendanceUpdated(res.todayStats);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (loading) return;
    const confirmOut = window.confirm(
      `Ready to wrap up today's session, ${firstName}? This will record your official check-out time and compute your total daily learning hours.`
    );
    if (!confirmOut) return;

    setLoading(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10B981', '#3B82F6', '#FFC21A'],
      });

      const res = await api.checkOut({
        studentId: student?.id,
      });

      if (res && res.success) {
        setStatus(res.todayStats);
        if (res.weeklyStats) {
          setWeeklyStats({
            totalHoursWeek: res.weeklyStats.totalHoursWeek,
            daysPresentWeek: res.weeklyStats.daysPresentWeek,
          });
        }
        if (res.monthlyStats) {
          setMonthlyStats({
            totalHoursMonth: res.monthlyStats.totalHoursMonth,
            daysPresentMonth: res.monthlyStats.daysPresentMonth,
          });
        }
        setMascotMood('rest');

        if (onAttendanceUpdated) {
          onAttendanceUpdated(res.todayStats);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const formatElapsedTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(11, 31, 77, 0.95) 0%, rgba(15, 41, 100, 0.92) 55%, rgba(7, 22, 56, 0.98) 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        color: '#ffffff',
        border: '1.5px solid rgba(242, 106, 27, 0.28)',
        boxShadow: '0 20px 45px rgba(11, 31, 77, 0.35), 0 0 35px rgba(242, 106, 27, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '28px',
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242, 106, 27, 0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-70px',
          left: '20%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Banner Tag & Live Clock */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(242, 106, 27, 0.18)',
              border: '1px solid rgba(242, 106, 27, 0.45)',
              color: '#FFB088',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={12} style={{ color: '#FFC21A' }} />
            WeGrow AI Companion &bull; Daily Attendance Portal
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: status.hasCheckedIn && !status.hasCheckedOut ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: status.hasCheckedIn && !status.hasCheckedOut ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '11px',
              fontWeight: 700,
              color: status.hasCheckedIn && !status.hasCheckedOut ? '#34D399' : '#94A3B8',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: status.hasCheckedIn && !status.hasCheckedOut ? '#10B981' : '#94A3B8',
                boxShadow: status.hasCheckedIn && !status.hasCheckedOut ? '0 0 8px #10B981' : 'none',
              }}
            />
            {status.hasCheckedOut
              ? 'Completed Today'
              : status.hasCheckedIn
              ? 'Campus Session Live'
              : 'Not Checked In Yet'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#E2E8F0',
            }}
          >
            <Clock size={13} style={{ color: '#00E5FF' }} />
            <span>{currentTime || '09:00:00 AM'}</span>
            <span style={{ color: '#64748B', fontSize: '10px' }}>IST</span>
          </div>
        </div>
      </div>

      {/* Main Mascot & Greeting Hero Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(140px, 170px) 1fr',
          gap: '24px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Animated Mascot Character Card */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Pulsing Aura Ring */}
          <div
            style={{
              position: 'relative',
              width: '135px',
              height: '135px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(242, 106, 27, 0.25) 0%, rgba(0, 229, 255, 0.2) 100%)',
              border: '2px solid rgba(242, 106, 27, 0.45)',
              padding: '8px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05) rotate(-1deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
            onClick={() => {
              confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
            }}
          >
            <img
              src="/mascot-optimized.png"
              alt="WeGrow AI Mascot Sparky"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/mascot.png';
              }}
            />

            {/* Sparkle badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                background: '#F26A1B',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '2px 6px',
                fontSize: '9px',
                fontWeight: 900,
                letterSpacing: '0.4px',
              }}
            >
              SPARKY
            </div>
          </div>

          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#FFB088',
              letterSpacing: '0.3px',
              textAlign: 'center',
            }}
          >
            AI Campus Bot
          </div>
        </div>

        {/* Mascot Speech Bubble & Welcome Details */}
        <div>
          {/* Welcome Title */}
          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#FFC21A',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '2px',
              }}
            >
              {getGreeting()}, Young Innovator! 👋
            </span>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 900,
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: '#ffffff',
              }}
            >
              Welcome back,{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #F26A1B 0%, #FFC21A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {student?.name || 'Explorer'}
              </span>
              !
            </h2>
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
              Roll No: <strong style={{ color: '#ffffff' }}>{student?.rollNumber || 'WG26-001'}</strong> &bull; Batch: <strong style={{ color: '#ffffff' }}>{student?.grade || 'Cohort Alpha'}</strong>
            </div>
          </div>

          {/* Action Row: Check-In / Check-Out Controls */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            {!status.hasCheckedIn && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #F26A1B 0%, #E5530A 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '13px 28px',
                  borderRadius: '16px',
                  fontSize: '15px',
                  fontWeight: 900,
                  letterSpacing: '0.3px',
                  boxShadow: '0 10px 25px rgba(242, 106, 27, 0.45)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(242, 106, 27, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(242, 106, 27, 0.45)';
                }}
              >
                <Zap size={18} style={{ color: '#FFC21A' }} />
                <span>{loading ? 'Recording Check-In...' : 'Take Daily Check-In 🚀'}</span>
              </button>
            )}

            {status.hasCheckedIn && !status.hasCheckedOut && (
              <>
                {/* Live Session Stopwatch */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    padding: '10px 18px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#10B981',
                      boxShadow: '0 0 10px #10B981',
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '10.5px', textTransform: 'uppercase', fontWeight: 800, color: '#34D399', letterSpacing: '0.5px' }}>
                      Active Lab Session Time
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
                      {formatElapsedTime(liveSeconds)}
                    </div>
                  </div>
                </div>

                {/* Check-Out Button */}
                <button
                  type="button"
                  onClick={handleCheckOut}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <LogOut size={16} />
                  <span>{loading ? 'Recording Check-Out...' : 'Take Daily Check-Out 🏁'}</span>
                </button>
              </>
            )}

            {status.hasCheckedOut && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  padding: '10px 18px',
                  borderRadius: '14px',
                  color: '#34D399',
                  fontSize: '13.5px',
                  fontWeight: 800,
                }}
              >
                <CheckCircle size={18} style={{ color: '#10B981' }} />
                <span>
                  Completed: In {status.checkInTime} &bull; Out {status.checkOutTime} ({status.todayHours} hrs credited)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Bottom KPI Metric Cards: Hours per Week & Month */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: '14px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Metric 1: Today's Hours */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(242, 106, 27, 0.2)',
              border: '1px solid rgba(242, 106, 27, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F26A1B',
            }}
          >
            <Clock size={19} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Today's Session
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
              {status.hasCheckedIn && !status.hasCheckedOut
                ? `${(liveSeconds / 3600).toFixed(1)} hrs`
                : `${status.todayHours || 0} hrs`}
            </div>
          </div>
        </div>

        {/* Metric 2: Total Hours This Week */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6',
            }}
          >
            <CalendarCheck size={19} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              This Week's Hours
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#60A5FA' }}>
              {weeklyStats.totalHoursWeek} hrs
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginLeft: '4px' }}>
                ({weeklyStats.daysPresentWeek} days)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Hours This Month */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
            }}
          >
            <TrendingUp size={19} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              This Month's Hours
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#34D399' }}>
              {monthlyStats.totalHoursMonth} hrs
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginLeft: '4px' }}>
                ({monthlyStats.daysPresentMonth} days)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Campus Streak & Milestone */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B',
            }}
          >
            <Flame size={19} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Lab Streak
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24' }}>
              {weeklyStats.daysPresentWeek || 1} Days Active 🔥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

