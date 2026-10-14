import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Trash2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
  confirmModal: (options: ConfirmDialogOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, type, message, title };

    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toast = {
    success: (message: string, title?: string) => showToast(message, 'success', title || 'Success'),
    error: (message: string, title?: string) => showToast(message, 'error', title || 'Action Failed'),
    warning: (message: string, title?: string) => showToast(message, 'warning', title || 'Attention'),
    info: (message: string, title?: string) => showToast(message, 'info', title || 'Information'),
  };

  const confirmModal = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const handleConfirmAction = () => {
    if (confirmDialog?.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog(null);
  };

  const handleCancelAction = () => {
    if (confirmDialog?.onCancel) {
      confirmDialog.onCancel();
    }
    setConfirmDialog(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, toast, confirmModal }}>
      {children}

      {/* Floating Toast Notification Stack */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '420px',
          width: 'calc(100vw - 40px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const accentColor = isSuccess
            ? '#10b981'
            : isError
            ? '#ef4444'
            : isWarning
            ? '#f59e0b'
            : '#38bdf8';

          const bgColor = isSuccess
            ? 'rgba(6, 78, 59, 0.95)'
            : isError
            ? 'rgba(127, 29, 29, 0.95)'
            : isWarning
            ? 'rgba(120, 53, 15, 0.95)'
            : 'rgba(15, 23, 42, 0.95)';

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: bgColor,
                backdropFilter: 'blur(12px)',
                border: `1px solid ${accentColor}`,
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 16px ${accentColor}33`,
                borderRadius: '14px',
                padding: '14px 16px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ color: accentColor, marginTop: '2px', flexShrink: 0 }}>
                {isSuccess && <CheckCircle2 size={20} />}
                {isError && <AlertCircle size={20} />}
                {isWarning && <AlertTriangle size={20} />}
                {!isSuccess && !isError && !isWarning && <Info size={20} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {t.title && (
                  <div style={{ fontWeight: 800, fontSize: '13.5px', marginBottom: '2px', color: '#ffffff' }}>
                    {t.title}
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#f1f5f9', lineHeight: 1.4, wordBreak: 'break-word' }}>
                  {t.message}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modern In-App Confirmation Modal */}
      {confirmDialog && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 12, 30, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 99998,
          }}
          onClick={handleCancelAction}
        >
          <div
            style={{
              background: '#0e172a',
              border: `1px solid ${confirmDialog.isDanger ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.35)'}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.4)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              textAlign: 'left',
              animation: 'modalPopIn 0.2s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: confirmDialog.isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: confirmDialog.isDanger ? '#ef4444' : '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {confirmDialog.isDanger ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                {confirmDialog.title}
              </h3>
            </div>

            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px' }}>
              {confirmDialog.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={handleCancelAction}
                className="btn btn-secondary"
                style={{ padding: '9px 18px', fontSize: '13.5px' }}
              >
                {confirmDialog.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="btn"
                style={{
                  background: confirmDialog.isDanger ? '#ef4444' : 'var(--grad-brand)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 20px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: confirmDialog.isDanger ? '0 4px 14px rgba(239, 68, 68, 0.4)' : undefined,
                }}
              >
                {confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
