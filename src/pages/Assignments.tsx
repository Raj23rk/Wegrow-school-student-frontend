import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, CheckCircle2, Clock, UploadCloud, AlertCircle, FileText, Send, Sparkles, PlusCircle, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import { Assignment, Student } from '../types';
import { useToast } from '../components/ToastContext';

interface AssignmentsProps {
  student?: Student | null;
}

export const Assignments: React.FC<AssignmentsProps> = ({ student }) => {
  const { toast } = useToast();
  const isAdmin = student?.role === 'admin' || student?.email?.includes('kumar') || student?.email?.includes('admin');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeSubmitModal, setActiveSubmitModal] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState('Machine Learning');
  const [asgBatch, setAsgBatch] = useState('Cohort Alpha (12-Month Diploma)');
  const [asgDueDate, setAsgDueDate] = useState('');
  const [asgMarks, setAsgMarks] = useState(50);
  const [asgDesc, setAsgDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.getAssignments();
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.assignments)
        ? res.assignments
        : Array.isArray(res)
        ? res
        : [];
      setAssignments(list);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim() || !asgDesc.trim()) {
      toast.warning('Title and Description are required', 'Validation Error');
      return;
    }
    try {
      setIsUploading(true);
      const res = await api.createAssignment({
        title: asgTitle.trim(),
        subject: asgSubject,
        grade: asgBatch,
        dueDate: asgDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        totalMarks: Number(asgMarks) || 50,
        description: asgDesc.trim(),
      });

      toast.success(res.message || 'Assignment published to student portal!', 'Assignment Created');
      setShowUploadModal(false);
      setAsgTitle('');
      setAsgDesc('');
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload assignment', 'Upload Failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.deleteAssignment(id);
      toast.success('Assignment deleted successfully', 'Assignment Deleted');
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete assignment', 'Delete Failed');
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

        {isAdmin && (
          <button
            id="btn-admin-upload-assignment"
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <PlusCircle size={16} /> Admin Upload Assignment
          </button>
        )}
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

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAssignment(asg._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      title="Delete Assignment"
                    >
                      <Trash2 size={16} />
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
      {/* Admin Upload Assignment Modal */}
      {showUploadModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Admin: Create &amp; Upload Assignment
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Assign practical tasks, code deliverables, or project milestones to student cohorts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. End-to-End Object Detection with YOLOv8"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Discipline / Subject</label>
                  <select
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value)}
                    className="input-field"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Deep Learning & CV">Deep Learning &amp; CV</option>
                    <option value="Generative AI & LLMs">Generative AI &amp; LLMs</option>
                    <option value="Python & Data Science">Python &amp; Data Science</option>
                    <option value="Agentic AI Automation">Agentic AI Automation</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Target Cohort / Batch</label>
                  <select
                    value={asgBatch}
                    onChange={(e) => setAsgBatch(e.target.value)}
                    className="input-field"
                  >
                    <option value="Cohort Alpha (12-Month Diploma)">Cohort Alpha (12-Month Diploma)</option>
                    <option value="Cohort Beta (AI & Robotics)">Cohort Beta (AI &amp; Robotics)</option>
                    <option value="Cohort Gamma (Young Coders Weekend)">Cohort Gamma (Young Coders Weekend)</option>
                    <option value="All Enrolled Cohorts">All Enrolled Cohorts</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Max Score (Marks)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={asgMarks}
                    onChange={(e) => setAsgMarks(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Task Instructions &amp; Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Detail the dataset, starter code instructions, validation metrics, and required deliverables..."
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                  {isUploading ? 'Publishing...' : 'Publish Assignment to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
