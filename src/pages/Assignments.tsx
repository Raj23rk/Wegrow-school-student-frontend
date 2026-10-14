import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, CheckCircle2, Clock, UploadCloud, AlertCircle, FileText, Send, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Assignment } from '../types';
import { useToast } from '../components/ToastContext';

export const Assignments: React.FC = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeSubmitModal, setActiveSubmitModal] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.getAssignments();
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (asg: Assignment) => {
    setActiveSubmitModal(asg);
    setSubmissionContent(asg.submission?.content || '');
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModal) return;
    try {
      setIsSubmitting(true);
      await api.submitAssignment(activeSubmitModal._id, {
        content: submissionContent,
        attachmentUrl: '/uploads/homework_solution.pdf',
      });

      toast.success('Assignment solution submitted successfully for grading!', 'Solution Submitted');
      setActiveSubmitModal(null);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit assignment', 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>AI Hands-On Projects &amp; Assignments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
            Track machine learning pipelines, PyTorch implementations, and faculty code review feedback
          </p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <ClipboardList size={44} style={{ color: 'var(--primary-light)', margin: '0 auto 16px', opacity: 0.7 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
            No Active Assignments Assigned (0)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '480px', margin: '0 auto' }}>
            All static seed assignment data has been cleared. New hands-on problem sets and project tasks will appear here once published by faculty.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {assignments.map((asg) => {
            const isGraded = asg.submission?.grade && asg.submission.grade !== 'Submitted (Pending Review)';
            return (
              <div key={asg._id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: asg.isSubmitted ? 'rgba(37, 99, 235, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: asg.isSubmitted ? '#38bdf8' : 'var(--primary-light)',
                    }}
                  >
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--primary-light)',
                          background: 'rgba(37, 99, 235, 0.18)',
                          border: '1px solid rgba(37, 99, 235, 0.35)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {asg.subject}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Assigned on {asg.assignedDate}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                      {asg.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Due: <strong>{asg.dueDate}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
                      Total Marks: {asg.totalMarks}
                    </div>
                  </div>

                  {asg.isSubmitted ? (
                    <span
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: 'rgba(37, 99, 235, 0.18)',
                        border: '1px solid rgba(37, 99, 235, 0.35)',
                        color: '#38bdf8',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={14} /> Submitted
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenSubmit(asg)}
                    >
                      <UploadCloud size={14} /> Submit Solution
                    </button>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {asg.description}
              </p>

              {/* Feedback and Teacher Remarks if submitted */}
              {asg.submission && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Student Submission Note:</span>
                    {asg.submission.grade && (
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: '6px',
                          background: isGraded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                          color: isGraded ? '#34d399' : 'var(--primary-light)',
                          fontWeight: 700,
                          fontSize: '12px',
                        }}
                      >
                        Grade: {asg.submission.grade} {asg.submission.marksObtained ? `(${asg.submission.marksObtained}/${asg.totalMarks})` : ''}
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>{asg.submission.content}</div>
                  {asg.submission.teacherRemarks && (
                    <div style={{ marginTop: '4px', color: '#818cf8', fontStyle: 'italic', fontSize: '12.5px' }}>
                      Teacher Feedback: "{asg.submission.teacherRemarks}"
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Submit Assignment Modal */}
      {activeSubmitModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
              Submit: {activeSubmitModal.title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {activeSubmitModal.subject} • Due by {activeSubmitModal.dueDate}
            </p>

            <form onSubmit={handleSubmitTask}>
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Your Solution Work / Explanation</label>
                <textarea
                  className="input-field"
                  rows={6}
                  placeholder="Paste your numerical solution, program source code, or essay text here..."
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  required
                />
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '2px dashed var(--border-glass)',
                  textAlign: 'center',
                  marginBottom: '24px',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <UploadCloud size={24} style={{ color: 'var(--primary-light)', margin: '0 auto 6px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Attach PDF / Document (Optional)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Files up to 25MB supported</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveSubmitModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
