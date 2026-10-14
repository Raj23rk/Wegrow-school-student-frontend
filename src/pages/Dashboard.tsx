import React, { useEffect, useState } from 'react';
import {
  Users,
  Radio,
  Award,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { api } from '../services/api';
import { TabType } from '../components/Sidebar';

interface DashboardProps {
  onNavigate: (tab: TabType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse-indicator" style={{ width: '16px', height: '16px', marginBottom: '14px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading academic telemetry & telemetry charts...</p>
        </div>
      </div>
    );
  }

  const { attendance, classes, tests } = data;

  return (
    <div className="page-fade-in">
      {/* Page Title & Quick Intro */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--primary-light)', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.35)', padding: '3px 10px', borderRadius: '20px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={12} /> AI &amp; Generative AI Master Track • Cohort 2026
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Student AI Academic Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
            Real-time attendance telemetry, live AI classrooms, and verified curriculum performance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('syllabus')}>
            <BookOpen size={15} /> AI Syllabus
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('quizzes')}>
            <Award size={15} /> Take Online Quiz
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('videos')}>
            <PlayCircle size={15} /> Video Lectures
          </button>
        </div>
      </div>

      {/* AI Syllabus Learning Path Banner with Visual Progress Shimmer */}
      <div className="roadmap-hero-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(37, 99, 235, 0.22)',
                border: '1px solid rgba(37, 99, 235, 0.38)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)',
              }}
            >
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Enrolled Curriculum Roadmap
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '2px 0' }}>
                Complete AI &amp; Generative AI Course (6 Phases • 20 Modules)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Active Track: <strong style={{ color: 'var(--text-primary)' }}>Phase 2: ML Fundamentals, Lobe &amp; Advanced ML</strong> &bull; 64 of 345 Hours Completed
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('syllabus')}
            className="btn btn-outline"
            style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            View Full AI Syllabus <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Dynamic Progress Shimmer Bar */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
              Active Milestone: <strong>Phase 2 in progress</strong>
            </span>
            <span style={{ color: 'var(--primary-light)', fontWeight: 800 }}>
              64 / 345 Hours (18.6% Total Curriculum Completed)
            </span>
          </div>
          <div className="progress-shimmer-track">
            <div className="progress-shimmer-bar" style={{ width: '18.6%' }} />
          </div>
        </div>
      </div>

      {/* 4 Essential Stat Metric Cards */}
      <div className="stats-grid">
        {/* Metric 1: Attendance Count & Rate */}
        <div className="glass-card glass-card-interactive stat-card">
          <div>
            <div className="stat-title">Student Attendance</div>
            <div className="stat-value" style={{ color: attendance.totalDays === 0 ? 'var(--text-secondary)' : attendance.percentage >= 85 ? '#38bdf8' : attendance.percentage >= 75 ? '#10b981' : '#fbbf24' }}>
              {attendance.totalDays === 0 ? 0 : attendance.percentage}%
            </div>
            <div className="stat-subtitle">
              <CheckCircle size={14} style={{ color: attendance.totalDays === 0 ? 'var(--text-muted)' : '#10b981' }} />
              <span>{attendance.presentCount || 0} Present / {attendance.totalDays || 0} Total Days</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              {attendance.totalDays === 0 ? (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(148, 163, 184, 0.12)', color: 'var(--text-muted)' }}>
                  No attendance recorded yet
                </span>
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: attendance.percentage >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: attendance.percentage >= 75 ? '#10b981' : '#f87171' }}>
                  {attendance.percentage >= 75 ? '✓ Healthy (>75% required)' : '⚠️ Low Attendance (<75%)'}
                </span>
              )}
            </div>
          </div>
          <div className="stat-icon-wrapper stat-icon-blue">
            <CalendarCheck size={24} />
          </div>
        </div>

        {/* Metric 2: Live & Ongoing Classes */}
        <div
          className="glass-card glass-card-interactive stat-card"
          style={{ borderColor: classes.ongoingCount > 0 ? 'rgba(37, 99, 235, 0.4)' : undefined }}
        >
          <div>
            <div className="stat-title">Live &amp; Ongoing Classes</div>
            <div className="stat-value" style={{ color: classes.ongoingCount > 0 ? 'var(--primary-light)' : 'var(--text-primary)' }}>
              {classes.ongoingCount} <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)' }}>In Session</span>
            </div>
            <div className="stat-subtitle">
              {classes.ongoingCount > 0 ? (
                <>
                  <span className="pulse-radar-dot" style={{ width: '7px', height: '7px', background: '#3b82f6' }} />
                  <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Interactive Lab Live</span>
                </>
              ) : (
                <span>Next class starting soon</span>
              )}
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-light)', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
                ⚡ AI GPU Lab 1
              </span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-light)' }}>
            <Radio size={24} />
          </div>
        </div>

        {/* Metric 3: Upcoming Scheduled Classes */}
        <div className="glass-card glass-card-interactive stat-card">
          <div>
            <div className="stat-title">Upcoming Classes Today</div>
            <div className="stat-value">{classes.upcomingCount}</div>
            <div className="stat-subtitle">
              <Clock size={14} style={{ color: 'var(--primary-light)' }} />
              <span>Across ML, Vision &amp; GenAI</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}>
                Full Day Schedule
              </span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#38bdf8' }}>
            <BookOpen size={24} />
          </div>
        </div>

        {/* Metric 4: Test Results Average */}
        <div className="glass-card glass-card-interactive stat-card">
          <div>
            <div className="stat-title">Test Results Average</div>
            <div className="stat-value" style={{ color: (tests.testsTaken || 0) === 0 ? 'var(--text-secondary)' : 'var(--primary-light)' }}>
              {(tests.testsTaken || 0) === 0 ? 0 : tests.averageScore}%
            </div>
            <div className="stat-subtitle">
              <TrendingUp size={14} style={{ color: (tests.testsTaken || 0) === 0 ? 'var(--text-muted)' : 'var(--primary-light)' }} />
              <span>{(tests.testsTaken || 0) === 0 ? 'No quizzes taken yet' : <>Highest Score: <strong>{tests.highestScore}%</strong></>}</span>
            </div>
            <div style={{ marginTop: '8px' }}>
              {(tests.testsTaken || 0) === 0 ? (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: 'rgba(148, 163, 184, 0.12)', color: 'var(--text-muted)' }}>
                  Awaiting Quiz Tasks
                </span>
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  ⭐ Cohort Top Performance
                </span>
              )}
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-light)' }}>
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* Active Ongoing Class Alert Banner if in session */}
      {classes.ongoingList && classes.ongoingList.length > 0 && (
        <div className="live-class-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'rgba(249, 115, 22, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f97316',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.25)',
              }}
            >
              <Radio size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="pulse-radar-dot" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  CLASS GOING ON RIGHT NOW
                </span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--primary-light)', fontWeight: 600 }}>
                  Live Session Active
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0' }}>
                {classes.ongoingList[0].subject} — {classes.ongoingList[0].topic}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Instructor: <strong style={{ color: 'var(--text-primary)' }}>{classes.ongoingList[0].teacher}</strong> • {classes.ongoingList[0].room} • {classes.ongoingList[0].startTime} to {classes.ongoingList[0].endTime}
              </p>
            </div>
          </div>

          <a
            href={classes.ongoingList[0].meetingUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glow-pulse"
            style={{ padding: '11px 24px', fontSize: '14px' }}
          >
            <ExternalLink size={16} /> Enter Live Classroom
          </a>
        </div>
      )}

      {/* Visual Analytics Charts View */}
      <div className="charts-grid">
        {/* Chart 1: Subject Performance Breakdown */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>AI Curriculum Core Mastery</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Verified test &amp; lab scores across 5 AI disciplines</p>
            </div>
            <div style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-glass)', color: 'var(--primary-light)', border: '1px solid var(--border-glass)', fontWeight: 700 }}>
              Phase 2 Evaluation
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tests.subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--chart-tooltip-border)',
                    borderRadius: '10px',
                    color: 'var(--chart-tooltip-text)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Score']}
                />
                <Bar dataKey="score" fill="url(#barGradient)" radius={[8, 8, 2, 2]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Attendance Trend (Last 7 Sessions) */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Attendance Track</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Daily presence continuity (100 = Full Day)</p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendance.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--chart-tooltip-border)',
                    borderRadius: '10px',
                    color: 'var(--chart-tooltip-text)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  }}
                  formatter={(val: any, name: any, item: any) => [
                    `${item.payload.status.toUpperCase()} (${val}%)`,
                    'Attendance',
                  ]}
                />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#attGradient)" />
                <defs>
                  <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Section: Today's Full Class Schedule & Latest Test Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Class Timetable */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Today's Scheduled Classes</h3>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'var(--bg-glass)', color: 'var(--primary-light)' }}>
              {classes.allToday?.length || 0} Periods
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classes.allToday?.map((cls: any) => {
              const isOngoing = cls.status === 'ongoing';
              return (
                <div
                  key={cls._id}
                  className={`schedule-item ${isOngoing ? 'schedule-item-live' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isOngoing ? 'rgba(249, 115, 22, 0.2)' : 'rgba(37, 99, 235, 0.12)',
                        border: `1px solid ${isOngoing ? 'rgba(249, 115, 22, 0.35)' : 'rgba(37, 99, 235, 0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOngoing ? '#f97316' : 'var(--primary-light)',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      {cls.startTime.split(' ')[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                        {cls.subject}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {cls.topic} • {cls.room}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isOngoing ? (
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#f97316',
                          background: 'rgba(249, 115, 22, 0.18)',
                          border: '1px solid rgba(249, 115, 22, 0.35)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span className="pulse-radar-dot" style={{ width: '6px', height: '6px' }} /> Live Now
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {cls.startTime} - {cls.endTime}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Test Results Summary */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Recent Evaluated Tasks</h3>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('quizzes')}>
              All Tasks <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tests.recentResults?.length > 0 ? (
              tests.recentResults.map((res: any) => (
                <div
                  key={res._id}
                  className="result-item"
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {res.quizTitle}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '10px', marginTop: '2px', alignItems: 'center' }}>
                      <span>Subject: {res.subject}</span>
                      <span>&bull;</span>
                      <span style={{ color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Verified &amp; Notified
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: res.passed ? '#10b981' : '#f87171' }}>
                      {res.score} / {res.totalMarks}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {res.percentage}% Score &bull; <strong style={{ color: '#38bdf8' }}>Grade A+</strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No completed test results yet. Take an online task to test your skills!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
