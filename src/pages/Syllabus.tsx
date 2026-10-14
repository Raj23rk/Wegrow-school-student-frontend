import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Lock,
  CheckCircle2,
  Search,
  Eye,
  Code2,
  Sparkles,
  Layers,
  Clock,
  Calendar,
  CheckSquare,
  ArrowRight,
  Award,
  Cpu,
  Brain,
  Database,
  Camera,
  Bot,
  Wand2,
  TableProperties,
} from 'lucide-react';
import { api } from '../services/api';
import { SyllabusItem, Student, SyllabusModule } from '../types';

interface SyllabusProps {
  student: Student | null;
}

export const Syllabus: React.FC<SyllabusProps> = ({ student }) => {
  const [phases, setPhases] = useState<SyllabusItem[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('phase_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Code' | 'No-code'>('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'deep' | 'matrix'>('deep');

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const res = await api.getSyllabus();
      if (res.data && res.data.length > 0) {
        setPhases(res.data);
        setSelectedPhaseId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load syllabus:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPhase = phases.find((p) => p.id === selectedPhaseId) || phases[0];

  // Filter modules based on search query & category filter
  const filteredModules: SyllabusModule[] = (currentPhase?.modules || []).filter((mod) => {
    if (typeFilter !== 'all' && mod.type !== typeFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = mod.name.toLowerCase().includes(q);
    const typeMatch = mod.type.toLowerCase().includes(q);
    const topicMatch = mod.subtopics.some(
      (sub) =>
        sub.category.toLowerCase().includes(q) ||
        sub.items.some((item) => item.toLowerCase().includes(q))
    );
    const projMatch = (mod.miniProjects || []).some((p) => p.toLowerCase().includes(q));
    return nameMatch || typeMatch || topicMatch || projMatch;
  });

  // Helper for phase icon
  const getPhaseIcon = (phaseNo: number) => {
    switch (phaseNo) {
      case 1:
        return <Brain size={18} />;
      case 2:
        return <Database size={18} />;
      case 3:
        return <Cpu size={18} />;
      case 4:
        return <Camera size={18} />;
      case 5:
        return <Bot size={18} />;
      case 6:
        return <Sparkles size={18} />;
      default:
        return <BookOpen size={18} />;
    }
  };

  // Helper for module badge
  const renderModuleBadge = (type: string) => {
    if (type === 'Code') {
      return (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '3px 9px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <Code2 size={12} /> Code Module
        </span>
      );
    }
    if (type === 'No-code') {
      return (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#fb923c',
            background: 'rgba(251, 146, 60, 0.15)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            padding: '3px 9px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <Wand2 size={12} /> No-Code Module
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#a78bfa',
          background: 'rgba(167, 139, 250, 0.15)',
          border: '1px solid rgba(167, 139, 250, 0.35)',
          padding: '3px 9px',
          borderRadius: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        <Award size={12} /> Capstone Project
      </span>
    );
  };

  return (
    <div
      className="view-only-restricted page-fade-in"
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: 'relative' }}
    >
      {/* Header Banner */}
      <div className="syllabus-hero-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--primary-light)',
                  background: 'rgba(37, 99, 235, 0.18)',
                  border: '1px solid rgba(37, 99, 235, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  letterSpacing: '0.5px',
                }}
              >
                <Sparkles size={12} /> WEGROW SKILL CAMPUS &amp; B SCHOOL ACCREDITED
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Eye size={12} /> Verified View-Only
              </span>
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
              Complete AI &amp; Generative AI Course Syllabus
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '780px', lineHeight: 1.5 }}>
              A 6-Phase Learning Path &bull; <strong>Code + No-code</strong> &bull; Complete one phase to unlock the next.
              Master Python, Machine Learning, Computer Vision, LLMs, RAG, and AI Agents with hands-on real-world projects.
            </p>
          </div>

          {/* Quick Metrics Badges (Theme-Adaptive) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="syllabus-stat-chip">
              <div className="syllabus-stat-label">Duration</div>
              <div className="syllabus-stat-val" style={{ color: 'var(--primary-light)' }}>12 Months</div>
            </div>
            <div className="syllabus-stat-chip">
              <div className="syllabus-stat-label">Total Hours</div>
              <div className="syllabus-stat-val" style={{ color: '#38bdf8' }}>345 Hours</div>
            </div>
            <div className="syllabus-stat-chip">
              <div className="syllabus-stat-label">Curriculum</div>
              <div className="syllabus-stat-val" style={{ color: '#fb923c' }}>6 Phases &bull; 20 Mods</div>
            </div>
          </div>
        </div>

        {/* Code vs No-Code Methodology Bar */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Learning Philosophy:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7dd3fc' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              <strong>Code Modules:</strong> Teach programming &amp; build technical depth.
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fdba74' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fb923c' }} />
              <strong>No-code Modules:</strong> Use visual AI tools so every learner builds real AI fast.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setViewMode(viewMode === 'deep' ? 'matrix' : 'deep')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <TableProperties size={14} />
              {viewMode === 'deep' ? 'View 20-Module Matrix' : 'View Deep Module Explorer'}
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <Lock size={13} />
              <span>Right-click protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Phase Roadmap Stepper / Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '6px' }}>
        {phases.map((phase) => {
          const isSelected = phase.id === selectedPhaseId;
          const pNum = phase.phaseNumber || 1;
          const isCompleted = pNum === 1;
          const isActive = pNum === 2;
          return (
            <button
              key={phase.id}
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`phase-stepper-btn ${isSelected ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isSelected ? 'var(--primary-light)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {getPhaseIcon(phase.phaseNumber || 1)} Phase {phase.phaseNumber}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(37, 99, 235, 0.25)' : 'var(--bg-glass)',
                    color: isSelected ? 'var(--primary-light)' : 'var(--text-muted)',
                  }}
                >
                  {phase.hours}h
                </span>
              </div>
              <div
                style={{
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {phase.focus?.split('–')[0]?.trim() || phase.subject}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', marginTop: '2px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{phase.months}</span>
                {isCompleted ? (
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '10.5px' }}>✓ Completed</span>
                ) : isActive ? (
                  <span style={{ color: '#f97316', fontWeight: 800, fontSize: '10.5px' }}>● In Progress</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>Upcoming</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Matrix Table View (When toggled) */}
      {viewMode === 'matrix' ? (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Complete 20-Module Master Overview</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>As outlined in the official curriculum roadmap</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Phase</th>
                  <th style={{ padding: '12px 14px' }}>No.</th>
                  <th style={{ padding: '12px 14px' }}>Module Name</th>
                  <th style={{ padding: '12px 14px' }}>Type</th>
                  <th style={{ padding: '12px 14px' }}>Duration</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {phases.flatMap((ph) =>
                  (ph.modules || []).map((mod) => (
                    <tr
                      key={mod.no}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--primary-light)' }}>
                        Phase {ph.phaseNumber}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{mod.no}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{mod.name}</td>
                      <td style={{ padding: '12px 14px' }}>{renderModuleBadge(mod.type)}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{mod.duration}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {mod.hours}h
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : currentPhase ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Phase Header Card with Search & Category Filter Pills */}
          <div
            className="glass-card"
            style={{
              padding: '24px 28px',
              borderLeft: '4px solid var(--primary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--primary-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                  }}
                >
                  <Calendar size={14} /> {currentPhase.months} &bull; Phase {currentPhase.phaseNumber} of 6
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
                  {currentPhase.phaseTitle || currentPhase.subject}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '4px', marginBottom: 0 }}>
                  Core Focus: <strong>{currentPhase.focus}</strong>
                </p>
              </div>

              {/* Search Within Phase */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search topics, tools, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: '10px',
                    background: 'var(--item-bg)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            {/* Quick Interactive Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Filter By Type:
              </span>
              <button
                className={`filter-pill-btn ${typeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTypeFilter('all')}
              >
                All ({currentPhase.modules?.length || 0})
              </button>
              <button
                className={`filter-pill-btn ${typeFilter === 'Code' ? 'active' : ''}`}
                onClick={() => setTypeFilter('Code')}
              >
                <Code2 size={13} /> Code Modules ({(currentPhase.modules || []).filter((m) => m.type === 'Code').length})
              </button>
              <button
                className={`filter-pill-btn ${typeFilter === 'No-code' ? 'active' : ''}`}
                onClick={() => setTypeFilter('No-code')}
              >
                <Wand2 size={13} /> No-Code Visual Tools ({(currentPhase.modules || []).filter((m) => m.type === 'No-code').length})
              </button>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing {filteredModules.length} of {currentPhase.modules?.length || 0} Modules
              </span>
            </div>
          </div>

          {/* Modules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredModules.map((module) => (
              <div
                key={module.no}
                className="glass-card"
                style={{
                  padding: '24px 28px',
                  borderColor:
                    module.type === 'Code'
                      ? 'rgba(56, 189, 248, 0.25)'
                      : module.type === 'No-code'
                      ? 'rgba(251, 146, 60, 0.25)'
                      : 'rgba(167, 139, 250, 0.25)',
                }}
              >
                {/* Module Title Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '16px',
                    marginBottom: '20px',
                    borderBottom: '1px solid var(--border-glass)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        background: 'rgba(37, 99, 235, 0.18)',
                        color: 'var(--primary-light)',
                        fontSize: '13px',
                        fontWeight: 800,
                        border: '1px solid rgba(37, 99, 235, 0.35)',
                      }}
                    >
                      MODULE {module.no}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{module.name}</h3>
                    {renderModuleBadge(module.type)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} style={{ color: 'var(--primary-light)' }} />
                      <strong>{module.hours} Hours</strong>
                    </span>
                    <span>&bull;</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} />
                      <span>{module.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Topics by Category Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  {module.subtopics.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--item-bg)',
                        border: '1px solid var(--border-glass)',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--primary-light)',
                          marginBottom: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Layers size={14} /> {sub.category}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {sub.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              fontSize: '13px',
                              color: 'var(--text-secondary)',
                              lineHeight: 1.4,
                            }}
                          >
                            <CheckCircle2
                              size={14}
                              style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}
                            />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Module Mini Projects */}
                {module.miniProjects && module.miniProjects.length > 0 && (
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.08)',
                      border: '1px solid rgba(37, 99, 235, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} /> Hands-on Mini Projects:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {module.miniProjects.map((proj, pIdx) => (
                        <span key={pIdx} className="mini-project-chip">
                          &bull; {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Phase Completion & Assessment Gate Box */}
          <div className="phase-criteria-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Award size={24} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                PHASE {currentPhase.phaseNumber} ACCREDITED COMPLETION CRITERIA
              </h3>
            </div>

            {/* Outcome */}
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '18px' }}>
              <strong>Target Competency:</strong> {currentPhase.outcome}
            </p>

            {/* Phase Projects Checklist */}
            {currentPhase.phaseProjects && currentPhase.phaseProjects.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Phase Capstone Deliverables ({currentPhase.phaseProjects.length} Projects):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
                  {currentPhase.phaseProjects.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'var(--stat-chip-bg)',
                        border: '1px solid var(--stat-chip-border)',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                      }}
                    >
                      <CheckSquare size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progression Rule & Next Phase Trigger */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-glass)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#fbbf24' }}>Milestone Progression:</strong> Finish all modules of the
                phase, submit the phase projects, and clear the phase assessment.
              </div>

              {currentPhase.nextPhase && (
                <button
                  onClick={() => {
                    const nextIndex = (currentPhase.phaseNumber || 1);
                    if (nextIndex < phases.length) {
                      setSelectedPhaseId(phases[nextIndex].id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="btn btn-glow-pulse"
                  style={{
                    padding: '10px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13.5px',
                  }}
                >
                  <span>NEXT ➜ {currentPhase.nextPhase.split('–')[0]}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
