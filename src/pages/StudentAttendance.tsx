import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  Download,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Student, AttendanceRecord, DailyAttendanceStatus } from '../types';
import { api } from '../services/api';
import { MascotWelcomeCheckin } from '../components/MascotWelcomeCheckin';

interface StudentAttendanceProps {
  student: Student | null;
}

export const StudentAttendance: React.FC<StudentAttendanceProps> = ({ student }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [todayStatus, setTodayStatus] = useState<DailyAttendanceStatus | null>(null);

  useEffect(() => {
    loadData();
  }, [student?.id, student?.rollNumber]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentAttendanceStatus(student?.id || student?.rollNumber);
      if (res && res.success) {
        setTodayStatus(res.todayStats);
        setWeeklyStats(res.weeklyStats);
        setMonthlyStats(res.monthlyStats);
        setHistory(res.monthlyStats?.records || []);
      }
    } catch (err) {
      console.warn('Failed to load student attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Page Title & Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--primary-light)',
            background: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.35)',
            padding: '3px 10px',
            borderRadius: '20px',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <CalendarCheck size={12} /> Student Academic Presence & Telemetry
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
          Daily Attendance & Hours Log
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', margin: 0 }}>
          Live check-in verification, weekly learning hour aggregates, and official campus session history.
        </p>
      </div>

      {/* Interactive Mascot Welcome & Check-In Banner */}
      <MascotWelcomeCheckin
        student={student}
        onAttendanceUpdated={(up) => {
          setTodayStatus(up);
          loadData();
        }}
      />

      {/* Weekly Hours Breakdown Card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck size={20} style={{ color: 'var(--brand-orange)' }} />
              Current Week Learning Hours Breakdown
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Aggregated from verified daily Check-In and Check-Out timestamps
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.15)',
                color: 'var(--primary-light)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
              }}
            >
              Week Goal: 35.0 hrs &bull; Logged: {weeklyStats?.totalHoursWeek || 0} hrs
            </span>
          </div>
        </div>

        {/* Progress Bar for Weekly Target */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Weekly Target Completion</span>
            <span style={{ color: 'var(--brand-orange)' }}>
              {Math.min(100, Math.round(((weeklyStats?.totalHoursWeek || 0) / 35) * 100))}%
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.round(((weeklyStats?.totalHoursWeek || 0) / 35) * 100))}%`,
                background: 'linear-gradient(90deg, #F26A1B 0%, #FFC21A 100%)',
                borderRadius: '9999px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Week Days Table / Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '12px' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
            // Find if there is a record for this day in weekly records
            const matchingRecord = (weeklyStats?.records || []).find((r: any) => {
              const d = new Date(r.date);
              const day = d.getDay(); // 0 is Sun, 1 is Mon...
              return day === idx + 1;
            });

            const hasAttended = Boolean(matchingRecord && matchingRecord.status !== 'absent');
            const hours = matchingRecord?.durationHours || (hasAttended ? 7.5 : 0);

            return (
              <div
                key={dayName}
                style={{
                  background: hasAttended ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: hasAttended ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  padding: '14px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {dayName}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: hasAttended ? '#10B981' : 'var(--text-muted)', margin: '6px 0 2px' }}>
                  {hasAttended ? `${hours}h` : '0h'}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: hasAttended ? '#34D399' : 'var(--text-muted)' }}>
                  {hasAttended ? (matchingRecord?.checkInTime ? `In: ${matchingRecord.checkInTime}` : 'Present') : 'Not marked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Timesheet Log Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: 'var(--brand-orange)' }} />
              Verified Daily Attendance Records
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Complete record of daily Check-In times, Check-Out times, and session durations
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Print Timesheet
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Check-In Time</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Check-Out Time</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Total Hours</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No previous attendance records recorded. Take your first daily check-in above!
                  </td>
                </tr>
              ) : (
                history.map((rec, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {rec.date}
                    </td>
                    <td style={{ padding: '14px', color: '#10B981', fontWeight: 700 }}>
                      {rec.checkInTime || '—'}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {rec.checkOutTime || '—'}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center', fontWeight: 800, color: 'var(--brand-orange)' }}>
                      {rec.durationHours ? `${rec.durationHours} hrs` : '—'}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          background:
                            rec.status === 'present'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : rec.status === 'late'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            rec.status === 'present'
                              ? '#10B981'
                              : rec.status === 'late'
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      >
                        {rec.status === 'present' && <CheckCircle size={12} />}
                        {rec.status === 'late' && <Clock size={12} />}
                        {rec.status === 'absent' && <AlertCircle size={12} />}
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                      {rec.remarks || 'Campus Lab Session'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

