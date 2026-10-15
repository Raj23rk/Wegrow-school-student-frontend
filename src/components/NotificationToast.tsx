import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, Mail, X } from 'lucide-react';

interface ToastProps {
  notification: {
    whatsapp?: { sent?: boolean; recipient: string; parentName: string; details: string };
    email?: { sent?: boolean; recipient: string; parentName: string; details: string };
    score?: number;
    totalMarks?: number;
    quizTitle?: string;
    title?: string;
  } | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const displayTitle = notification.title || (
    notification.quizTitle?.includes('Notice')
      ? 'Official Notice Dispatched!'
      : notification.quizTitle?.includes('Attendance')
      ? 'Attendance Alerts Dispatched!'
      : notification.quizTitle?.includes('Broadcast')
      ? 'Broadcast Dispatched!'
      : 'Notification Dispatched Successfully!'
  );

  const parentNameFallback =
    notification.whatsapp?.parentName ||
    notification.email?.parentName ||
    'Parent';

  const cleanWhatsappDetails = (notification.whatsapp?.details || '')
    .replace(/{parentName}/gi, parentNameFallback)
    .replace(/{parent_name}/gi, parentNameFallback)
    .replace(/{studentName}/gi, 'Student')
    .replace(/https:\/\/wegrowskillcampus\.edu\/portal/gi, 'https://school.wegrowbschool.in/#login');

  const cleanEmailDetails = (notification.email?.details || '')
    .replace(/{parentName}/gi, parentNameFallback)
    .replace(/{parent_name}/gi, parentNameFallback);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100000,
        maxWidth: '430px',
        width: 'calc(100vw - 40px)',
        background: '#0B1F4D',
        border: '1.5px solid rgba(242, 106, 27, 0.6)',
        borderRadius: '16px',
        boxShadow: '0 20px 45px rgba(11, 31, 77, 0.45), 0 0 20px rgba(242, 106, 27, 0.25)',
        padding: '16px 18px',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(46, 213, 115, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2ed573',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              {displayTitle}
            </h4>
            {notification.quizTitle && (
              <p style={{ fontSize: '11.5px', color: '#cbd5e1', margin: '2px 0 0', fontWeight: 600 }}>
                {notification.quizTitle}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: '10px' }}>
        {/* WhatsApp Alert */}
        {notification.whatsapp && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
            <div style={{ color: '#25D366', marginTop: '2px', flexShrink: 0 }}>
              <MessageCircle size={16} />
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
              <span style={{ fontWeight: 700, color: '#25D366' }}>WhatsApp: </span>
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{notification.whatsapp.recipient}</span>
              {notification.whatsapp.parentName && (
                <span style={{ color: '#F26A1B', fontWeight: 700 }}> ({notification.whatsapp.parentName})</span>
              )}
              {cleanWhatsappDetails && (
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontStyle: 'italic' }}>
                  {cleanWhatsappDetails.length > 95 ? `${cleanWhatsappDetails.slice(0, 95)}...` : cleanWhatsappDetails}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Alert */}
        {notification.email && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
            <div style={{ color: '#38bdf8', marginTop: '2px', flexShrink: 0 }}>
              <Mail size={16} />
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>Email: </span>
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{notification.email.recipient}</span>
              {cleanEmailDetails && (
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  {cleanEmailDetails}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auto-Close Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #F26A1B, #FFC21A)',
            animation: 'toastProgress 4.5s linear forwards',
          }}
        />
      </div>
    </div>
  );
};
