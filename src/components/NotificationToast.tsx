import React from 'react';
import { CheckCircle2, MessageCircle, Mail, X } from 'lucide-react';

interface ToastProps {
  notification: {
    whatsapp: { sent: boolean; recipient: string; parentName: string; details: string };
    email: { sent: boolean; recipient: string; parentName: string; details: string };
    score: number;
    totalMarks: number;
    quizTitle: string;
  } | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '440px',
        width: '90%',
        background: '#0f172a',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.2)',
        padding: '20px',
        animation: 'modal-fade-in 0.3s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              Test Submitted & Evaluated!
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Score: <strong style={{ color: '#38bdf8' }}>{notification.score} / {notification.totalMarks}</strong> in {notification.quizTitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
        {/* WhatsApp Alert */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ color: '#25D366', marginTop: '2px' }}>
            <MessageCircle size={18} />
          </div>
          <div style={{ fontSize: '12.5px' }}>
            <span style={{ fontWeight: 600, color: '#25D366' }}>WhatsApp Sent to Parent: </span>
            <span style={{ color: '#cbd5e1' }}>{notification.whatsapp.recipient} ({notification.whatsapp.parentName})</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {notification.whatsapp.details}
            </div>
          </div>
        </div>

        {/* Email Alert */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ color: '#38bdf8', marginTop: '2px' }}>
            <Mail size={18} />
          </div>
          <div style={{ fontSize: '12.5px' }}>
            <span style={{ fontWeight: 600, color: '#38bdf8' }}>Email Sent to Parent: </span>
            <span style={{ color: '#cbd5e1' }}>{notification.email.recipient}</span>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {notification.email.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
