import React, { useState, useEffect } from 'react';
import {
  Clock,
  CalendarCheck,
  TrendingUp,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  Edit3,
  LogOut,
  Calendar,
  Zap,
  Users,
  ChevronRight,
  X,
  UserCheck,
  ShieldAlert,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  CheckSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './ToastContext';
import { StudentTimesheetItem, StudentTimesheetSummary } from '../types';
import {
  getCurriculumProgress,
  saveCurriculumProgress,
  CurriculumProgress,
} from '../services/curriculumProgress';
import { AI_COURSE_SYLLABUS } from '../data/aiSyllabusData';

interface AdminAttendanceTimesheetProps {
  onNotificationSent?: (payload: any) => void;
}

export const AdminAttendanceTimesheet: React.FC<AdminAttendanceTimesheetProps> = ({
  onNotificationSent,
}) => {
  const { toast } = useToast();

  // Sub-tabs: 'timesheet' | 'batch' | 'curriculum' | 'analytics'
  const [activeSubTab, setActiveSubTab] = useState<'timesheet' | 'batch' | 'curriculum' | 'analytics'>('timesheet');

  // Curriculum Progress state
  const [curriculum, setCurriculum] = useState<CurriculumProgress>(getCurriculumProgress());
  const [selectedPhaseNo, setSelectedPhaseNo] = useState<number>(curriculum.activePhaseNumber);
  const [coveredTopicText, setCoveredTopicText] = useState<string>(curriculum.recentCoveredTopic);
  const [completedHoursInput, setCompletedHoursInput] = useState<number>(curriculum.completedHours);
  const [milestoneInput, setMilestoneInput] = useState<string>(curriculum.activeMilestone);
  const [curriculumBatch, setCurriculumBatch] = useState<string>(curriculum.batch);
  const [savingCurriculum, setSavingCurriculum] = useState(false);

  // Timesheet state
  const [timesheet, setTimesheet] = useState<StudentTimesheetItem[]>([]);
  const [summary, setSummary] = useState<StudentTimesheetSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'completed' | 'absent' | 'late'>('all');

  // Batch Roster state (for existing batch attendance)
  const [batchRecords, setBatchRecords] = useState<any[]>([]);
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchSuccessMsg, setBatchSuccessMsg] = useState('');

  // Daily Analytics state
  const [dailyStatsSummary, setDailyStatsSummary] = useState<any>(null);
  const [dailyHistory, setDailyHistory] = useState<any[]>([]);

  // Manual Entry Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualStudentId, setManualStudentId] = useState('');
  const [manualStudentName, setManualStudentName] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualCheckIn, setManualCheckIn] = useState('09:15 AM');
  const [manualCheckOut, setManualCheckOut] = useState('05:30 PM');
  const [manualStatus, setManualStatus] = useState('present');
  const [manualRemarks, setManualRemarks] = useState('Verified by campus administration');
  const [savingManual, setSavingManual] = useState(false);

  // Student Detail History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<StudentTimesheetItem | null>(null);

  const handlePhaseSelect = (phaseNo: number) => {
    setSelectedPhaseNo(phaseNo);
    const found = AI_COURSE_SYLLABUS.find((p) => p.phaseNumber === phaseNo);
    if (found) {
      let cumulativeHours = 0;
      for (const p of AI_COURSE_SYLLABUS) {
        if (p.phaseNumber < phaseNo) {
          cumulativeHours += p.hours;
        } else if (p.phaseNumber === phaseNo) {
          cumulativeHours += Math.round(p.hours * 0.4); // default ~40% through phase
        }
      }
      setCompletedHoursInput(cumulativeHours);
      setMilestoneInput(`${found.phaseTitle} in progress`);
      if (found.modules && found.modules.length > 0) {
        setCoveredTopicText(`Module ${found.modules[0].no}: ${found.modules[0].name}`);
      }
    }
  };

  const handleSaveCurriculumProgress = () => {
    setSavingCurriculum(true);
    const foundPhase = AI_COURSE_SYLLABUS.find((p) => p.phaseNumber === selectedPhaseNo);
    const phaseTitle = foundPhase ? foundPhase.phaseTitle : `Phase ${selectedPhaseNo}`;

    const compPhases: number[] = [];
    for (let i = 1; i < selectedPhaseNo; i++) {
      compPhases.push(i);
    }

    const updated: CurriculumProgress = {
      courseTitle: 'Complete AI & Generative AI Course (6 Phases • 20 Modules)',
      activePhaseNumber: selectedPhaseNo,
      activePhaseTitle: phaseTitle,
      activeMilestone: milestoneInput.trim() || `${phaseTitle} in progress`,
      completedHours: Math.min(345, Math.max(0, Number(completedHoursInput) || 0)),
      totalHours: 345,
      completedPhases: compPhases,
      recentCoveredTopic: coveredTopicText.trim(),
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      batch: curriculumBatch,
    };

    saveCurriculumProgress(updated);
    setCurriculum(updated);
    setSavingCurriculum(false);
    toast.success(
      `Curriculum Progress Saved! Active Track: ${phaseTitle} (${updated.completedHours}/345h)`
    );
  };

  useEffect(() => {
    loadTimesheet();
    loadBatchRoster();
    loadDailyAnalytics();
  }, [dateFilter, batchFilter]);

  const loadTimesheet = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentsTimesheet({
        date: dateFilter,
        batch: batchFilter === 'all' ? undefined : batchFilter,
        search: search.trim() || undefined,
      });
      if (res && res.success) {
        setTimesheet(res.timesheet || []);
        setSummary(res.summary || null);
      }
    } catch (err: any) {
      console.warn('loadTimesheet error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBatchRoster = async () => {
    try {
      const b = batchFilter === 'all' ? 'Cohort Alpha (12-Month Diploma)' : batchFilter;
      const res = await api.getBatchAttendance(b, dateFilter);
      if (res && res.success) {
        setBatchRecords(res.records || []);
      }
    } catch (err) {
      console.warn('loadBatchRoster error:', err);
    }
  };

  const loadDailyAnalytics = async () => {
    try {
      const b = batchFilter === 'all' ? 'Cohort Alpha (12-Month Diploma)' : batchFilter;
      const res = await api.getDailyAttendanceStats({ batch: b, days: 30 });
      if (res && res.success) {
        setDailyStatsSummary(res.summary);
        setDailyHistory(res.data || []);
      }
    } catch (err) {
      console.warn('loadDailyAnalytics error:', err);
    }
  };

  // Quick Check-Out Handler
  const handleQuickCheckOut = async (studentId: string, studentName: string) => {
    try {
      const res = await api.checkOut({ studentId, date: dateFilter });
      if (res && res.success) {
        toast.success(
          `Check-out recorded for ${studentName} at ${res.todayStats?.checkOutTime || 'now'} (${res.todayStats?.todayHours || 0} hrs)!`,
          'Check-Out Recorded'
        );
        loadTimesheet();
        loadBatchRoster();
      }
    } catch (err: any) {
      toast.error(err.message || 'Check-out failed', 'Error');
    }
  };

  // Open prefilled Manual Entry Modal
  const openManualModalForStudent = (item?: StudentTimesheetItem) => {
    if (item) {
      setManualStudentId(item.studentId);
      setManualStudentName(item.name);
      setManualDate(dateFilter);
      setManualCheckIn(item.checkInTime !== '—' ? item.checkInTime : '09:15 AM');
      setManualCheckOut(item.checkOutTime !== '—' && item.checkOutTime !== 'Active Now' ? item.checkOutTime : '05:30 PM');
      setManualStatus(item.status === 'not_marked' ? 'present' : item.status);
      setManualRemarks(item.remarks || 'Admin verified session');
    } else {
      if (timesheet.length > 0) {
        setManualStudentId(timesheet[0].studentId);
        setManualStudentName(timesheet[0].name);
      }
      setManualDate(dateFilter);
      setManualCheckIn('09:15 AM');
      setManualCheckOut('05:30 PM');
      setManualStatus('present');
      setManualRemarks('Manual entry by campus administrator');
    }
    setManualModalOpen(true);
  };

  // Save Manual Entry
  const handleSaveManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentId) {
      toast.error('Please select a student', 'Validation Error');
      return;
    }
    setSavingManual(true);
    try {
      const res = await api.recordAttendanceManualEntry({
        studentId: manualStudentId,
        studentName: manualStudentName,
        date: manualDate,
        checkInTime: manualCheckIn,
        checkOutTime: manualCheckOut,
        status: manualStatus,
        remarks: manualRemarks,
      });

      if (res && res.success) {
        toast.success(res.message || 'Attendance entry updated!', 'Manual Entry Saved');
        setManualModalOpen(false);
        loadTimesheet();
        loadBatchRoster();
      }
    } catch (err: any) {
      toast.error(err.message || 'Manual entry save failed', 'Error');
    } finally {
      setSavingManual(false);
    }
  };

  // Save Batch Roster & WhatsApp Alerts
  const handleSaveBatchAttendance = async () => {
    setSavingBatch(true);
    setBatchSuccessMsg('');
    try {
      const b = batchFilter === 'all' ? 'Cohort Alpha (12-Month Diploma)' : batchFilter;
      const res = await api.markBatchAttendance({
        batch: b,
        date: dateFilter,
        records: batchRecords,
      });
      if (res && res.success) {
        setBatchSuccessMsg(res.message || 'Batch attendance saved successfully!');
        toast.success(res.message || 'Batch attendance saved!', 'Batch Roster');
        if (onNotificationSent && res.dispatchedAlerts?.length > 0) {
          onNotificationSent({
            studentName: 'Absent Batch Students',
            channel: 'whatsapp',
            recipientPhone: `${res.dispatchedAlerts.length} parent contacts`,
            dispatchedCount: res.dispatchedAlerts.length,
            message: `Absence notice sent to ${res.dispatchedAlerts.length} parents`,
          });
        }
        loadDailyAnalytics();
        loadTimesheet();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save batch attendance', 'Error');
    } finally {
      setSavingBatch(false);
    }
  };

  // Export Timesheet CSV
  const handleExportCSV = () => {
    if (timesheet.length === 0) {
      toast.info('No timesheet records available to export.', 'Export Timesheet');
      return;
    }
    const headers = [
      'Student Name',
      'Roll Number',
      'Batch / Course',
      'Email',
      'Date',
      'Check-In Time',
      'Check-Out Time',
      'Today Hours',
      'Total Hours This Week',
      'Total Hours This Month',
      'Days Present This Month',
      'Status',
      'Check-In Method',
      'Remarks',
    ];
    const rows = timesheet.map((row) => [
      `"${row.name.replace(/"/g, '""')}"`,
      `"${row.rollNumber}"`,
      `"${(row.batch || '').replace(/"/g, '""')}"`,
      `"${row.email || ''}"`,
      `"${row.date}"`,
      `"${row.checkInTime || '—'}"`,
      `"${row.checkOutTime || '—'}"`,
      row.durationHoursToday || 0,
      row.totalHoursWeek || 0,
      row.totalHoursMonth || 0,
      row.daysPresentMonth || 0,
      `"${row.status}"`,
      `"${row.checkInMethod || 'student_portal'}"`,
      `"${(row.remarks || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WeGrow_Attendance_Timesheet_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance timesheet exported to CSV!', 'Export Complete');
  };

  // Filtered timesheet data
  const filteredTimesheet = timesheet.filter((item) => {
    if (statusFilter === 'checked_in') return item.checkInTime !== '—' && (item.checkOutTime === '—' || item.checkOutTime === 'Active Now');
    if (statusFilter === 'completed') return item.checkInTime !== '—' && item.checkOutTime !== '—' && item.checkOutTime !== 'Active Now';
    if (statusFilter === 'absent') return item.status === 'absent';
    if (statusFilter === 'late') return item.status === 'late';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Card */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--primary-light)', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.35)', padding: '3px 10px', borderRadius: '20px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <CalendarCheck size={12} /> Institutional Attendance & Telemetry
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Student Attendance, Check-In / Out & Hours Calculator
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Individual student check-in & check-out timesheet, weekly & monthly learning hour calculations, and batch security alerts.
            </p>
          </div>

          {/* Sub-view Navigation Pills */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-glass)', padding: '5px', borderRadius: '14px', border: '1px solid var(--border-glass)', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('timesheet')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: activeSubTab === 'timesheet' ? 'var(--brand-orange)' : 'transparent',
                color: activeSubTab === 'timesheet' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeSubTab === 'timesheet' ? '0 4px 12px rgba(242, 106, 27, 0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Clock size={15} /> Student Check-In & Hours Timesheet
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('batch')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: activeSubTab === 'batch' ? 'var(--brand-orange)' : 'transparent',
                color: activeSubTab === 'batch' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeSubTab === 'batch' ? '0 4px 12px rgba(242, 106, 27, 0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <CalendarCheck size={15} /> Batch Roster & Alerts
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('curriculum')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: activeSubTab === 'curriculum' ? 'var(--brand-orange)' : 'transparent',
                color: activeSubTab === 'curriculum' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeSubTab === 'curriculum' ? '0 4px 12px rgba(242, 106, 27, 0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <BookOpen size={15} /> Topic Coverage &amp; Roadmap Progress 🎯
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('analytics')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: activeSubTab === 'analytics' ? 'var(--brand-orange)' : 'transparent',
                color: activeSubTab === 'analytics' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeSubTab === 'analytics' ? '0 4px 12px rgba(242, 106, 27, 0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <TrendingUp size={15} /> Date-Wise Analytics
            </button>
          </div>
        </div>

        {/* KPI Metrics Summary Bar (Active on Timesheet view) */}
        {activeSubTab === 'timesheet' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
              gap: '12px',
              paddingTop: '18px',
              borderTop: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Students
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                {summary?.totalStudents ?? timesheet.length}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                In Campus (Checked In)
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
                {summary?.checkedInToday ?? 0}
              </div>
            </div>

            <div style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: '14px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                Completed Today
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary-light)', marginTop: '4px' }}>
                {summary?.completedToday ?? 0}
              </div>
            </div>

            <div style={{ background: 'rgba(242, 106, 27, 0.08)', border: '1px solid rgba(242, 106, 27, 0.25)', borderRadius: '14px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-orange)', textTransform: 'uppercase' }}>
                Hours This Week
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--brand-orange)', marginTop: '4px' }}>
                {summary?.totalCampusHoursThisWeek ?? 0} hrs
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>
                Hours This Month
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
                {summary?.totalCampusHoursThisMonth ?? 0} hrs
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '12px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>
                Avg Hours / Student / Wk
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>
                {summary?.avgHoursWeek ?? 0} hrs
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: STUDENT CHECK-IN & CHECK-OUT TIMESHEET           */}
      {/* ======================================================== */}
      {activeSubTab === 'timesheet' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Filter & Action Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              {/* Search by student name or roll */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search student name, roll..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadTimesheet()}
                  className="input-field"
                  style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
                />
              </div>

              {/* Batch Filter */}
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="input-field"
                style={{ width: 'auto', fontSize: '13px', height: '38px', padding: '6px 12px' }}
              >
                <option value="all">All Academic Batches</option>
                <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
              </select>

              {/* Date Selector */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
                style={{ width: 'auto', fontSize: '13px', height: '38px', padding: '6px 12px' }}
              />

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-glass)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                {(['all', 'checked_in', 'completed', 'absent', 'late'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: statusFilter === st ? 'var(--primary-light)' : 'transparent',
                      color: statusFilter === st ? '#ffffff' : 'var(--text-muted)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {st === 'all' ? 'All' : st === 'checked_in' ? 'Active' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => loadTimesheet()}
                className="btn btn-secondary btn-sm"
                title="Refresh timesheet data"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn btn-secondary btn-sm"
                title="Download CSV report"
              >
                <Download size={14} /> Export CSV
              </button>
              <button
                type="button"
                onClick={() => openManualModalForStudent()}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={15} /> Record Manual Entry
              </button>
            </div>
          </div>

          {/* Timesheet Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '220px' }}>Student Name &amp; ID</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '110px' }}>Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '120px' }}>Check-In</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '120px' }}>Check-Out</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', minWidth: '110px' }}>Hours Today</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '150px' }}>Hours / Week</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '150px' }}>Hours / Month</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', minWidth: '110px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', minWidth: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimesheet.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px 14px', color: 'var(--text-muted)' }}>
                      No students found matching your criteria. Try adjusting your search or date filter.
                    </td>
                  </tr>
                ) : (
                  filteredTimesheet.map((row) => {
                    const isCheckedIn = row.checkInTime !== '—';
                    const isCheckedOut = row.checkOutTime !== '—' && row.checkOutTime !== 'Active Now';
                    const isCurrentlyActive = isCheckedIn && !isCheckedOut;

                    return (
                      <tr key={row.studentId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        {/* Student Info */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={row.avatar}
                              alt={row.name}
                              style={{ width: '38px', height: '38px', borderRadius: '12px', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>
                                {row.name}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {row.rollNumber} &bull; <span style={{ color: 'var(--primary-light)' }}>{row.batch}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {row.date}
                        </td>

                        {/* Check-In Time */}
                        <td style={{ padding: '14px' }}>
                          {isCheckedIn ? (
                            <div>
                              <div style={{ color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} />
                                {row.checkInTime}
                              </div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                {row.checkInMethod === 'admin_manual' ? 'Admin Manual' : 'Student Portal'}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>

                        {/* Check-Out Time */}
                        <td style={{ padding: '14px' }}>
                          {isCurrentlyActive ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10B981',
                                fontSize: '11.5px',
                                fontWeight: 800,
                              }}
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite' }} />
                              Active Now
                            </span>
                          ) : isCheckedOut ? (
                            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                              {row.checkOutTime}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>

                        {/* Hours Today */}
                        <td style={{ padding: '14px', textAlign: 'center', fontWeight: 800, color: 'var(--brand-orange)' }}>
                          {row.durationHoursToday > 0 ? `${row.durationHoursToday} hrs` : isCurrentlyActive ? 'In progress' : '0 hrs'}
                        </td>

                        {/* Total Hours Per Week */}
                        <td style={{ padding: '14px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                              <span style={{ color: '#3B82F6', fontWeight: 800 }}>{row.totalHoursWeek} hrs</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>/ 35h goal</span>
                            </div>
                            <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.min(100, Math.round((row.totalHoursWeek / 35) * 100))}%`,
                                  background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                                  borderRadius: '9999px',
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Total Hours Per Month */}
                        <td style={{ padding: '14px' }}>
                          <div>
                            <div style={{ fontWeight: 800, color: '#10B981', fontSize: '13.5px' }}>
                              {row.totalHoursMonth} hrs
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {row.daysPresentMonth} days present
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              background:
                                row.status === 'present'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : row.status === 'late'
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : row.status === 'absent'
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : 'rgba(255, 255, 255, 0.06)',
                              color:
                                row.status === 'present'
                                  ? '#10B981'
                                  : row.status === 'late'
                                  ? '#F59E0B'
                                  : row.status === 'absent'
                                  ? '#EF4444'
                                  : 'var(--text-muted)',
                            }}
                          >
                            {row.status === 'present' ? 'Present' : row.status === 'late' ? 'Late' : row.status === 'absent' ? 'Absent' : 'Not Marked'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {isCurrentlyActive && (
                              <button
                                type="button"
                                onClick={() => handleQuickCheckOut(row.studentId, row.name)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(242, 106, 27, 0.15)', color: 'var(--brand-orange)', border: '1px solid rgba(242, 106, 27, 0.3)' }}
                                title="Check Out Student"
                              >
                                <LogOut size={13} /> Check-Out
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => openManualModalForStudent(row)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="Edit Attendance & Hours"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentForHistory(row);
                                setHistoryModalOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="View Student History"
                            >
                              <Calendar size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: BATCH ROSTER & WHATSAPP ABSENCE DISPATCH         */}
      {/* ======================================================== */}
      {activeSubTab === 'batch' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Batch Roster &amp; Parent WhatsApp Dispatch
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Toggle present/absent across the batch. Absent students will trigger instant automated WhatsApp alerts to parents.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={batchFilter === 'all' ? 'Cohort Alpha (12-Month Diploma)' : batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="input-field"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              >
                <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          {batchSuccessMsg && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', marginBottom: '18px', fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} />
              <span>{batchSuccessMsg}</span>
            </div>
          )}

          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
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
                {batchRecords.map((r, idx) => (
                  <tr key={r.studentId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {r.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {r.rollNumber}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {r.parentName}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 600 }}>
                      {r.parentWhatsApp}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '4px', background: 'var(--bg-glass)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                        {(['present', 'late', 'absent'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              const updated = [...batchRecords];
                              updated[idx].status = st;
                              setBatchRecords(updated);
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '7px',
                              border: 'none',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              background:
                                r.status === st
                                  ? st === 'present'
                                    ? '#10b981'
                                    : st === 'late'
                                    ? '#f59e0b'
                                    : '#ef4444'
                                  : 'transparent',
                              color: r.status === st ? '#ffffff' : 'var(--text-muted)',
                              textTransform: 'capitalize',
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="text"
                        value={r.remarks || ''}
                        onChange={(e) => {
                          const updated = [...batchRecords];
                          updated[idx].remarks = e.target.value;
                          setBatchRecords(updated);
                        }}
                        className="input-field"
                        style={{ padding: '4px 8px', fontSize: '12.5px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => loadBatchRoster()}
              className="btn btn-secondary"
            >
              <RefreshCw size={14} /> Reset Roster
            </button>
            <button
              onClick={handleSaveBatchAttendance}
              disabled={savingBatch}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              {savingBatch ? 'Saving & Alerting Parents...' : 'Save Attendance & Dispatch WhatsApp to Absent Parents'}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: DATE-WISE DAILY ANALYTICS                        */}
      {/* ======================================================== */}
      {activeSubTab === 'analytics' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} style={{ color: 'var(--brand-orange)' }} />
                Date-Wise Daily Attendance Trends
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Historical daily attendance rates and presence counts
              </p>
            </div>

            {dailyStatsSummary && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary-light)', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
                  Enrolled: {dailyStatsSummary.totalEnrolled || 1}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  Today Present: {dailyStatsSummary.todayPresent ?? 1}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  Today Absent: {dailyStatsSummary.todayAbsent ?? 0}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  Rate: {dailyStatsSummary.todayPercentage ?? 100}%
                </span>
              </div>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Total</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Present</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Absent</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Late / Excused</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left' }}>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {dailyHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px 14px', color: 'var(--text-muted)' }}>
                      No daily records found. Save batch attendance above to populate trends.
                    </td>
                  </tr>
                ) : (
                  dailyHistory.map((row: any) => {
                    const pct = row.attendancePercentage !== undefined ? row.attendancePercentage : 100;
                    return (
                      <tr key={row.date} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {row.date} {row.date === dateFilter && <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 800 }}>(Selected)</span>}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          {row.totalStudents || 1}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', color: '#10B981', fontWeight: 700 }}>
                          {row.presentCount || 0}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', color: row.absentCount > 0 ? '#EF4444' : 'var(--text-muted)', fontWeight: row.absentCount > 0 ? 800 : 500 }}>
                          {row.absentCount || 0}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {(row.lateCount || 0) + (row.excusedCount || 0)}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${pct}%`,
                                  background: pct >= 80 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #F59E0B, #EF4444)',
                                  borderRadius: '9999px',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: pct >= 80 ? '#10B981' : '#F59E0B', minWidth: '36px' }}>
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: TOPIC COVERAGE & ENROLLED CURRICULUM PROGRESS    */}
      {/* ======================================================== */}
      {activeSubTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Info Banner with Live Preview */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--brand-orange)', background: 'rgba(242, 106, 27, 0.15)', border: '1px solid rgba(242, 106, 27, 0.35)', padding: '3px 10px', borderRadius: '20px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  <Sparkles size={12} /> Student Dashboard Dynamic Sync
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={22} style={{ color: 'var(--brand-orange)' }} />
                  Curriculum Topic Coverage &amp; Progress Updater
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Update the topics taught today, active phase, and completed hours. This live updates the student portal&apos;s Enrolled Curriculum Roadmap and Syllabus milestone status.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '10px', background: 'var(--bg-glass)', color: 'var(--primary-light)', border: '1px solid var(--border-glass)' }}>
                  Total Curriculum: 345 Hours &bull; 6 Phases &bull; 20 Modules
                </span>
              </div>
            </div>

            {/* LIVE PREVIEW: The Student Portal Banner */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
                👁️ Live Student Portal Banner Preview:
              </div>
              <div className="roadmap-hero-card" style={{ marginBottom: 0 }}>
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
                        {curriculum.courseTitle}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                        Active Track: <strong style={{ color: 'var(--text-primary)' }}>{curriculum.activePhaseTitle}</strong> &bull; {curriculum.completedHours} of {curriculum.totalHours} Hours Completed
                      </p>
                      {curriculum.recentCoveredTopic && (
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#93c5fd', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                          <span>⚡ Covered Today:</span> <strong>{curriculum.recentCoveredTopic}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className="btn btn-outline"
                    style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.8 }}
                  >
                    View Full AI Syllabus <ArrowUpRight size={14} />
                  </span>
                </div>

                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                      Active Milestone: <strong>{curriculum.activeMilestone}</strong>
                    </span>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 800 }}>
                      {curriculum.completedHours} / {curriculum.totalHours} Hours ({Math.min(100, Math.max(0, ((curriculum.completedHours / curriculum.totalHours) * 100))).toFixed(1)}% Total Curriculum Completed)
                    </span>
                  </div>
                  <div className="progress-shimmer-track">
                    <div className="progress-shimmer-bar" style={{ width: `${Math.min(100, Math.max(0, ((curriculum.completedHours / curriculum.totalHours) * 100)))}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Controls Card */}
          <div className="glass-card" style={{ padding: '26px' }}>
            <h4 style={{ fontSize: '16.5px', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={18} style={{ color: 'var(--brand-orange)' }} />
              Update Topic Covered Today &amp; Curriculum Milestone
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
              {/* Batch Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Target Student Cohort / Batch
                </label>
                <select
                  value={curriculumBatch}
                  onChange={(e) => setCurriculumBatch(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                >
                  <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                  <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                  <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
                </select>
              </div>

              {/* Active Phase Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Current Active Phase
                </label>
                <select
                  value={selectedPhaseNo}
                  onChange={(e) => handlePhaseSelect(Number(e.target.value))}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                >
                  {AI_COURSE_SYLLABUS.map((p) => (
                    <option key={p.id} value={p.phaseNumber}>
                      {p.phaseTitle} ({p.hours} Hours &bull; {p.modules?.length || 0} Modules)
                    </option>
                  ))}
                </select>
              </div>

              {/* Cumulative Hours Completed */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Cumulative Completed Hours (Out of 345)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    min={0}
                    max={345}
                    value={completedHoursInput}
                    onChange={(e) => setCompletedHoursInput(Number(e.target.value))}
                    className="input-field"
                    style={{ flex: 1, fontSize: '14px', fontWeight: 700 }}
                  />
                  <button
                    type="button"
                    onClick={() => setCompletedHoursInput((prev) => Math.min(345, prev + 2))}
                    className="btn btn-secondary btn-sm"
                    title="Add 2 hours"
                  >
                    +2h
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompletedHoursInput((prev) => Math.min(345, prev + 4))}
                    className="btn btn-secondary btn-sm"
                    title="Add 4 hours"
                  >
                    +4h
                  </button>
                </div>
              </div>
            </div>

            {/* Topic Covered Today (Input & Syllabus Quick Chips) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Topic / Concept Covered Today in Class / Lab
              </label>
              <input
                type="text"
                value={coveredTopicText}
                onChange={(e) => setCoveredTopicText(e.target.value)}
                placeholder="e.g. Convolutional Neural Networks, Max-Pooling & Lobe Vision Models"
                className="input-field"
                style={{ width: '100%', fontSize: '14px', marginBottom: '10px' }}
              />

              {/* Quick suggestions from selected phase modules */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Quick Insert from {AI_COURSE_SYLLABUS.find(p => p.phaseNumber === selectedPhaseNo)?.phaseTitle.split(':')[0]}:
                </span>
                {AI_COURSE_SYLLABUS.find(p => p.phaseNumber === selectedPhaseNo)?.modules?.map((m) => (
                  <button
                    key={m.no}
                    type="button"
                    onClick={() => setCoveredTopicText(`Module ${m.no}: ${m.name}`)}
                    style={{
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.25)',
                      color: 'var(--primary-light)',
                      borderRadius: '8px',
                      padding: '3px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(37, 99, 235, 0.25)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)')}
                  >
                    M{m.no}: {m.name.length > 32 ? m.name.substring(0, 32) + '...' : m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Status Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Active Milestone Label (Shown on Progress Bar)
              </label>
              <input
                type="text"
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                placeholder="e.g. Phase 2 in progress • ML Fundamentals, Lobe & Advanced ML"
                className="input-field"
                style={{ width: '100%', fontSize: '13.5px' }}
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '18px' }}>
              <button
                type="button"
                onClick={() => {
                  const curr = getCurriculumProgress();
                  setCurriculum(curr);
                  setSelectedPhaseNo(curr.activePhaseNumber);
                  setCoveredTopicText(curr.recentCoveredTopic);
                  setCompletedHoursInput(curr.completedHours);
                  setMilestoneInput(curr.activeMilestone);
                  setCurriculumBatch(curr.batch);
                }}
                className="btn btn-secondary"
              >
                <RefreshCw size={14} /> Reset Form
              </button>

              <button
                type="button"
                onClick={handleSaveCurriculumProgress}
                disabled={savingCurriculum}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 800 }}
              >
                <CheckCircle size={16} />
                {savingCurriculum ? 'Updating Progress...' : 'Save & Update Student Roadmap Progress 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: MANUAL CHECK-IN & CHECK-OUT ENTRY               */}
      {/* ======================================================== */}
      {manualModalOpen && (
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
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0B1F4D',
              border: '1.5px solid rgba(242, 106, 27, 0.35)',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              color: '#ffffff',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(242, 106, 27, 0.2)', border: '1px solid rgba(242, 106, 27, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F26A1B' }}>
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                    Manual Check-In &amp; Check-Out
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                    Record or adjust student presence and learning hours
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveManualEntry} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Student */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#E2E8F0', marginBottom: '6px' }}>
                  Select Student
                </label>
                <select
                  value={manualStudentId}
                  onChange={(e) => {
                    setManualStudentId(e.target.value);
                    const found = timesheet.find((s) => s.studentId === e.target.value);
                    if (found) setManualStudentName(found.name);
                  }}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {timesheet.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.rollNumber}) &bull; {s.batch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#E2E8F0', marginBottom: '6px' }}>
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                  required
                />
              </div>

              {/* Check-In and Check-Out Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#E2E8F0', marginBottom: '6px' }}>
                    Check-In Time
                  </label>
                  <input
                    type="text"
                    value={manualCheckIn}
                    onChange={(e) => setManualCheckIn(e.target.value)}
                    placeholder="e.g. 09:15 AM"
                    className="input-field"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#E2E8F0', marginBottom: '6px' }}>
                    Check-Out Time
                  </label>
                  <input
                    type="text"
                    value={manualCheckOut}
                    onChange={(e) => setManualCheckOut(e.target.value)}
                    placeholder="e.g. 05:30 PM"
                    className="input-field"
                    style={{ width: '100%', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#E2E8F0', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                >
                  <option value="present">Present (In Campus)</option>
                  <option value="late">Late Arrival</option>
                  <option value="absent">Absent</option>
                  <option value="excused">Excused Leave</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#E2E8F0', marginBottom: '6px' }}>
                  Mentor / Admin Remarks
                </label>
                <input
                  type="text"
                  value={manualRemarks}
                  onChange={(e) => setManualRemarks(e.target.value)}
                  placeholder="e.g. Verified by Sivakasi campus mentor"
                  className="input-field"
                  style={{ width: '100%', fontSize: '13.5px' }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingManual}
                  className="btn btn-primary"
                  style={{ padding: '10px 22px' }}
                >
                  {savingManual ? 'Saving Entry...' : 'Save Attendance & Calculate Hours'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: STUDENT ATTENDANCE HISTORY BREAKDOWN            */}
      {/* ======================================================== */}
      {historyModalOpen && selectedStudentForHistory && (
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
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0B1F4D',
              border: '1.5px solid rgba(242, 106, 27, 0.35)',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#ffffff',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={selectedStudentForHistory.avatar}
                  alt={selectedStudentForHistory.name}
                  style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0 }}>
                    {selectedStudentForHistory.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                    {selectedStudentForHistory.rollNumber} &bull; {selectedStudentForHistory.batch}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Hours Today
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--brand-orange)', marginTop: '2px' }}>
                  {selectedStudentForHistory.durationHoursToday || 0} hrs
                </div>
              </div>
              <div style={{ background: 'rgba(37, 99, 235, 0.1)', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase' }}>
                  Hours This Week
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#3B82F6', marginTop: '2px' }}>
                  {selectedStudentForHistory.totalHoursWeek || 0} hrs
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>
                  Hours This Month
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981', marginTop: '2px' }}>
                  {selectedStudentForHistory.totalHoursMonth || 0} hrs
                </div>
              </div>
            </div>

            {/* Recent Daily Logs Table */}
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#E2E8F0', marginBottom: '10px' }}>
              Recent Check-In &amp; Check-Out History
            </div>
            <div style={{ border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Check-In</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Check-Out</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Hours</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedStudentForHistory.recentHistory || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                        No history logs available for this student.
                      </td>
                    </tr>
                  ) : (
                    (selectedStudentForHistory.recentHistory || []).map((h: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#ffffff' }}>
                          {h.date}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#10B981', fontWeight: 700 }}>
                          {h.checkInTime || '—'}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#94A3B8' }}>
                          {h.checkOutTime || '—'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: 'var(--brand-orange)' }}>
                          {h.durationHours ? `${h.durationHours}h` : '—'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              background: h.status === 'present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: h.status === 'present' ? '#34D399' : '#EF4444',
                            }}
                          >
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

