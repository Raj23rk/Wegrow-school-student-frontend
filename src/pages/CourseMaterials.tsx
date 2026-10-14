import React, { useState, useEffect } from 'react';
import { BookMarked, Calendar, Tag, PlusCircle, Search, FileText, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { api } from '../services/api';
import { CourseMaterial, Student } from '../types';
import { useToast } from '../components/ToastContext';

interface CourseMaterialsProps {
  student?: Student | null;
}

export const CourseMaterials: React.FC<CourseMaterialsProps> = ({ student }) => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeMaterial, setActiveMaterial] = useState<CourseMaterial | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Upload daily notes state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Machine Learning');
  const [noteTeacher, setNoteTeacher] = useState('Prof. Vikram Rao');
  const [noteSummary, setNoteSummary] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchMaterials(selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    if (materials && materials.length > 0) {
      if (!activeMaterial || !materials.some((m) => m._id === activeMaterial._id)) {
        setActiveMaterial(materials[0]);
      }
    } else {
      setActiveMaterial(null);
    }
  }, [materials]);

  const fetchMaterials = async (subject: string) => {
    try {
      setLoading(true);
      const res = await api.getMaterials(subject);
      const list = Array.isArray(res.data) ? res.data : [];
      setMaterials(list);
    } catch (err) {
      console.error('Failed to load materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMaterial({
        title: noteTitle,
        subject: noteSubject,
        teacher: noteTeacher,
        summary: noteSummary,
        content: noteContent,
        tags: [noteSubject, 'Daily Notes', 'Class Revision'],
      });

      toast.success('Daily class notes uploaded successfully!', 'Notes Uploaded');
      setShowUploadModal(false);
      setNoteTitle('');
      setNoteSummary('');
      setNoteContent('');
      fetchMaterials(selectedSubject);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload daily notes', 'Upload Failed');
    }
  };

  const renderFormattedNotes = (raw: string) => {
    if (!raw) return null;
    const lines = raw.split('\n');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} style={{ height: '6px' }} />;
          }

          // Heading 3: ### Heading
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  marginTop: '16px',
                  marginBottom: '6px',
                  letterSpacing: '-0.3px',
                  borderLeft: '4px solid var(--primary)',
                  paddingLeft: '10px',
                }}
              >
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            );
          }

          // Heading 2: ## Heading
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  marginTop: '20px',
                  marginBottom: '8px',
                  letterSpacing: '-0.4px',
                }}
              >
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }

          // Section Header: **1. Title:** or similar
          if (trimmed.startsWith('**') && trimmed.includes('**')) {
            const boldMatch = trimmed.match(/^\*\*(.*?)\*\*(.*)$/);
            if (boldMatch) {
              return (
                <div
                  key={idx}
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginTop: '12px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--brand-orange)', marginRight: '6px' }}>▶</span>
                  <strong style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{boldMatch[1]}</strong>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{boldMatch[2]}</span>
                </div>
              );
            }
          }

          // Bullet list items: - Item or * Item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const itemText = trimmed.replace(/^[-*]\s+/, '');
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  paddingLeft: '14px',
                  margin: '3px 0',
                }}
              >
                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '16px', lineHeight: 1.2 }}>•</span>
                <span
                  style={{
                    fontSize: '14.5px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                  }}
                >
                  {itemText}
                </span>
              </div>
            );
          }

          // Default Paragraph
          return (
            <p
              key={idx}
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.7,
                margin: '2px 0',
              }}
            >
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  const subjects = ['All', 'Machine Learning', 'Deep Learning & CV', 'Generative AI & LLMs', 'Python & Data Science', 'No-Code AI'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>AI Course Material &amp; Daily Lab Notes</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
            Daily lecture summaries, PyTorch code architectures, ML formulas, and GenAI system diagrams
          </p>
        </div>

        {student?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="btn-upload-daily-notes"
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              <PlusCircle size={16} /> Upload Daily Class Notes
            </button>
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            style={{
              padding: '7px 16px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              background: selectedSubject === sub ? 'var(--grad-brand)' : 'var(--bg-glass)',
              color: selectedSubject === sub ? '#ffffff' : 'var(--text-secondary)',
              border: `1px solid ${selectedSubject === sub ? 'transparent' : 'var(--border-glass)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {sub}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
          <div className="pulse-indicator" style={{ width: '18px', height: '18px', marginBottom: '10px' }} />
        </div>
      ) : materials.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--border-glass)' }}>
          <BookMarked size={48} style={{ color: 'var(--brand-orange)', margin: '0 auto 16px', opacity: 0.9 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
            No Class Notes Published (0)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            No daily revision notes are currently available for {selectedSubject === 'All' ? 'any subject' : selectedSubject}. When instructors publish class notes from the Admin Control Center, they will automatically appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }}>
          {/* Left Column: Daily Notes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {materials.map((mat) => {
            const isSelected = activeMaterial?._id === mat._id;
            return (
              <div
                key={mat._id}
                className="glass-card"
                onClick={() => setActiveMaterial(mat)}
                style={{
                  padding: '18px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--primary)' : undefined,
                  background: isSelected ? 'rgba(99, 102, 241, 0.08)' : undefined,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--primary-light)',
                      background: 'rgba(99, 102, 241, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {mat.subject}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {mat.date}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.4, marginBottom: '6px' }}>
                  {mat.title}
                </h4>

                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                  {mat.summary}
                </p>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  By: <strong>{mat.teacher}</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Daily Note Viewer */}
        {activeMaterial ? (
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '18px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--primary-light)',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {activeMaterial.subject} Class Notes
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Recorded on {activeMaterial.date}
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0' }}>
                {activeMaterial.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <User size={14} />
                <span>Instructor: <strong>{activeMaterial.teacher}</strong></span>
              </div>
            </div>

            {/* High-Contrast Bold Block Letter Note Content */}
            <div
              style={{
                background: 'var(--item-bg)',
                padding: '28px',
                borderRadius: '14px',
                border: '1px solid var(--border-glass)',
                marginBottom: '24px',
              }}
            >
              {renderFormattedNotes(activeMaterial.content)}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {activeMaterial.tags.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Tag size={11} /> {t}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a class note from the left to read details
          </div>
        )}
      </div>
      )}

      {/* Upload Daily Notes Modal */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              Upload Daily Class Notes
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Publish daily takeaways, summary equations, and homework hints for students
            </p>

            <form onSubmit={handleUploadNotes}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label className="input-label">Note Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Daily Class Notes: Wave Optics & Diffraction"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label className="input-label">Subject</label>
                    <select
                      className="input-field"
                      value={noteSubject}
                      onChange={(e) => setNoteSubject(e.target.value)}
                      style={{ background: '#1e293b' }}
                    >
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Deep Learning & CV">Deep Learning & CV</option>
                      <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                      <option value="Python & Data Science">Python & Data Science</option>
                      <option value="No-Code AI">No-Code AI</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Teacher / Instructor</label>
                    <input
                      type="text"
                      className="input-field"
                      value={noteTeacher}
                      onChange={(e) => setNoteTeacher(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Brief Summary</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Key concepts covered in today's class"
                    value={noteSummary}
                    onChange={(e) => setNoteSummary(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Detailed Notes / Markdown Content</label>
                  <textarea
                    className="input-field"
                    rows={6}
                    placeholder="Formulas, key theorems, and daily homework questions..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload & Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
