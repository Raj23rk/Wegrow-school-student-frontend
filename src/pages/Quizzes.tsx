import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  MessageCircle,
  Mail,
  PlusCircle,
  Sparkles,
  AlertCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Quiz, Question, Student } from '../types';
import { useToast } from '../components/ToastContext';

interface QuizzesProps {
  student: Student | null;
  onNotificationSent: (data: any) => void;
}

export const Quizzes: React.FC<QuizzesProps> = ({ student, onNotificationSent }) => {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin upload task modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminTitle, setAdminTitle] = useState('Machine Learning Diagnostic Assessment');
  const [adminSubject, setAdminSubject] = useState('Machine Learning');
  const [adminDuration, setAdminDuration] = useState(15);
  const [adminQuestions, setAdminQuestions] = useState<
    { questionText: string; options: string[]; correctOptionIndex: number; marks: number; explanation: string }[]
  >([
    {
      questionText: 'What technique prevents overfitting in deep neural networks by randomly deactivating neurons during training?',
      options: ['Dropout', 'Softmax Layer', 'Batch Inversion', 'Linear Projection'],
      correctOptionIndex: 0,
      marks: 5,
      explanation: 'Dropout randomly sets input elements to zero with probability p during training, preventing units from co-adapting.',
    },
    {
      questionText: 'Which mechanism allows Transformer architectures to calculate token relationships across an entire sequence concurrently?',
      options: ['Multi-Head Self-Attention', 'Recurrent Hidden States', 'Convolutional Max-Pooling', 'Markov Decision Chains'],
      correctOptionIndex: 0,
      marks: 5,
      explanation: 'Self-Attention projects tokens into Query, Key, and Value vectors to compute all pairwise token dependencies in parallel.',
    },
  ]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Timer countdown while taking quiz
  useEffect(() => {
    if (!activeQuiz || quizResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, quizResult, selectedAnswers]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.getQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const res = await api.getQuizById(quizId);
      setActiveQuiz(res.data);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(res.data.durationMinutes * 60);
      setQuizResult(null);
    } catch (err: any) {
      toast.error(err.message || 'Could not load quiz questions', 'Quiz Error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    try {
      setIsSubmitting(true);
      const timeSpent = activeQuiz.durationMinutes * 60 - timeLeft;

      const res = await api.submitQuiz(activeQuiz._id, {
        studentId: student?.id || 'std_001',
        answers: selectedAnswers,
        timeSpentSeconds: Math.max(10, timeSpent),
      });

      setQuizResult(res.result);

      // Trigger Confetti Celebration if passed
      if (res.result.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      // Notify parent alert toast
      onNotificationSent({
        ...res.result.parentAlerts,
        score: res.result.score,
        totalMarks: res.result.totalMarks,
        quizTitle: activeQuiz.title,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit quiz task', 'Submission Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminAddQuestion = () => {
    setAdminQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 5,
        explanation: '',
      },
    ]);
  };

  const handleAdminSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createQuiz({
        title: adminTitle,
        subject: adminSubject,
        durationMinutes: adminDuration,
        questions: adminQuestions,
      });

      toast.success('Admin task uploaded successfully! New quiz is now active.', 'Quiz Active');
      setShowAdminModal(false);
      fetchQuizzes();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create quiz', 'Creation Failed');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. ACTIVE QUIZ TAKING INTERFACE
  if (activeQuiz && !quizResult) {
    const questions = activeQuiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

    return (
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Quiz Header with Timer & Progress */}
        <div className="glass-card" style={{ padding: '20px 28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                {activeQuiz.subject} Task
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0' }}>{activeQuiz.title}</h2>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: timeLeft < 120 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                border: `1px solid ${timeLeft < 120 ? '#ef4444' : 'rgba(99, 102, 241, 0.4)'}`,
                color: timeLeft < 120 ? '#f87171' : 'var(--primary-light)',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              <Clock size={16} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'var(--grad-brand)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                QUESTION {currentQuestionIndex + 1}
              </span>
              <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
                {currentQuestion.marks} Marks
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.5, marginBottom: '24px', color: 'var(--text-primary)' }}>
              {currentQuestion.questionText}
            </h3>

            {/* Radio Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {currentQuestion.options.map((opt: string, idx: number) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(currentQuestion.id, idx)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-glass)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '15px', color: isSelected ? '#ffffff' : 'var(--text-secondary)' }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next Question <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  id="btn-submit-quiz-final"
                  className="btn btn-success"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  style={{ padding: '10px 24px' }}
                >
                  {isSubmitting ? 'Evaluating & Alerting Parent...' : (
                    <>
                      <Send size={16} /> Submit Task & Send Alerts
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. QUIZ RESULT & PARENT NOTIFICATION REPORT SCREEN
  if (quizResult && activeQuiz) {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '36px', textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: quizResult.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: quizResult.passed ? '#34d399' : '#fbbf24',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Award size={40} />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
            {quizResult.passed ? 'Congratulations! Task Passed' : 'Task Completed — Keep Practicing!'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
            {activeQuiz.title}
          </p>

          {/* Big Score Box */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '8px',
              padding: '16px 36px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: 900, color: quizResult.passed ? '#38bdf8' : '#fbbf24' }}>
              {quizResult.score}
            </span>
            <span style={{ fontSize: '24px', color: 'var(--text-muted)' }}>/ {quizResult.totalMarks}</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-light)', marginLeft: '8px' }}>
              ({quizResult.percentage}%)
            </span>
          </div>

          <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px' }}>
            "{quizResult.feedback}"
          </p>

          {/* PARENT WHATSAPP & MAIL CONFIRMATION BADGE */}
          <div
            style={{
              padding: '18px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, rgba(37, 211, 102, 0.12) 0%, rgba(99, 102, 241, 0.1) 100%)',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 700, fontSize: '14px' }}>
              <ShieldCheck size={18} />
              <span>Parent Notification Dispatched Automatically:</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <MessageCircle size={16} style={{ color: '#25D366' }} />
                <span>WhatsApp sent to <strong>{quizResult.parentAlerts?.whatsapp?.recipient || student?.parentWhatsApp}</strong></span>
                <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(37,211,102,0.2)', color: '#25D366', fontSize: '11px', fontWeight: 700 }}>
                  SENT
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <Mail size={16} style={{ color: '#818cf8' }} />
                <span>Email scorecard sent to <strong>{quizResult.parentAlerts?.email?.recipient || student?.parentEmail}</strong></span>
                <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.2)', color: 'var(--primary-light)', fontSize: '11px', fontWeight: 700 }}>
                  SENT
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setActiveQuiz(null);
              setQuizResult(null);
              fetchQuizzes();
            }}
          >
            Return to Tasks Catalog
          </button>
        </div>

        {/* Detailed Question Review */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Detailed Answer Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quizResult.questionReview?.map((q: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${q.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {q.isCorrect ? (
                      <CheckCircle size={18} style={{ color: '#34d399' }} />
                    ) : (
                      <XCircle size={18} style={{ color: '#f87171' }} />
                    )}
                    <span style={{ fontWeight: 600, fontSize: '14.5px' }}>Question {idx + 1}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: q.isCorrect ? '#34d399' : '#f87171' }}>
                    +{q.marksAwarded} / {q.totalMarks} Marks
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  {q.questionText}
                </p>

                <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Your Answer: </span>
                    <strong style={{ color: q.isCorrect ? '#34d399' : '#f87171' }}>
                      {q.studentSelected !== undefined ? q.options[q.studentSelected] : 'Unanswered'}
                    </strong>
                  </div>
                  {!q.isCorrect && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Correct Answer: </span>
                      <strong style={{ color: '#34d399' }}>{q.options[q.correctOptionIndex]}</strong>
                    </div>
                  )}
                  {q.explanation && (
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px', fontStyle: 'italic' }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. TASKS CATALOG SCREEN & ADMIN QUESTION UPLOAD
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Student Tasks & Quizzes</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
            Answer online test questions. Scores automatically dispatched to parent Email & WhatsApp.
          </p>
        </div>

        {student?.role === 'admin' && (
          <button
            id="btn-admin-upload-task"
            className="btn btn-secondary"
            onClick={() => setShowAdminModal(true)}
          >
            <PlusCircle size={16} /> Admin Upload Questions
          </button>
        )}
      </div>

      {/* Quiz List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
          <div className="pulse-indicator" style={{ width: '18px', height: '18px', marginBottom: '10px' }} />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--border-glass)' }}>
          <FileQuestion size={48} style={{ color: 'var(--brand-orange)', margin: '0 auto 16px', opacity: 0.9 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
            No Active Quizzes Published (0)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            No evaluative diagnostic assessments are currently active for your cohort. When faculty publish tests from the Admin Control Center, they will automatically appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: 'var(--primary-light)',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {quiz.subject}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Due: {quiz.dueDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.4, marginBottom: '8px' }}>
                  {quiz.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                  {quiz.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    fontSize: '12.5px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Questions: </span>
                    <strong>{quiz.questionCount || 5}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Duration: </span>
                    <strong>{quiz.durationMinutes} mins</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Max Marks: </span>
                    <strong style={{ color: '#38bdf8' }}>{quiz.totalMarks}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  id={`btn-start-${quiz._id}`}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handleStartQuiz(quiz._id)}
                >
                  Start Online Task <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Upload Question & Answer Modal */}
      {showAdminModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
              Admin: Upload New Question & Answer Task
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Create a new evaluation quiz. Once students answer, automated scorecards will reach parent WhatsApp and Email.
            </p>

            <form onSubmit={handleAdminSaveTask}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Task Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={adminTitle}
                    onChange={(e) => setAdminTitle(e.target.value)}
                    placeholder="e.g. Physics Chapter 5 Revision"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Subject</label>
                  <input
                    type="text"
                    className="input-field"
                    value={adminSubject}
                    onChange={(e) => setAdminSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Duration (Mins)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={adminDuration}
                    onChange={(e) => setAdminDuration(Number(e.target.value))}
                    min={5}
                    required
                  />
                </div>
              </div>

              {/* Dynamic Questions Input List */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Questions ({adminQuestions.length})</h4>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAdminAddQuestion}>
                    + Add Question
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '300px', overflowY: 'auto' }}>
                  {adminQuestions.map((q, qIndex) => (
                    <div key={qIndex} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          className="input-field"
                          placeholder={`Question ${qIndex + 1} text`}
                          value={q.questionText}
                          onChange={(e) => {
                            const updated = [...adminQuestions];
                            updated[qIndex].questionText = e.target.value;
                            setAdminQuestions(updated);
                          }}
                          required
                        />
                        <input
                          type="number"
                          className="input-field"
                          style={{ width: '80px' }}
                          placeholder="Marks"
                          value={q.marks}
                          onChange={(e) => {
                            const updated = [...adminQuestions];
                            updated[qIndex].marks = Number(e.target.value);
                            setAdminQuestions(updated);
                          }}
                          min={1}
                        />
                      </div>

                      {/* Options & Correct Choice */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="radio"
                              name={`correct_${qIndex}`}
                              checked={q.correctOptionIndex === optIndex}
                              onChange={() => {
                                const updated = [...adminQuestions];
                                updated[qIndex].correctOptionIndex = optIndex;
                                setAdminQuestions(updated);
                              }}
                              title="Mark as correct answer"
                            />
                            <input
                              type="text"
                              className="input-field"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              value={opt}
                              onChange={(e) => {
                                const updated = [...adminQuestions];
                                updated[qIndex].options[optIndex] = e.target.value;
                                setAdminQuestions(updated);
                              }}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdminModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Task to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
