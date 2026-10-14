import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dueAmount: number;
  studentName: string;
  studentEmail: string;
  onSuccess: (paymentResult: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  dueAmount,
  studentName,
  studentEmail,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(dueAmount > 0 ? dueAmount : 15000);
  const [feeType, setFeeType] = useState('Academic Term 2 Tuition & Activity Fee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayNow = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Create order on Hono backend
      const res = await api.createRazorpayOrder({ amount, feeType });
      const orderData = res.data;

      // 2. If Razorpay SDK is available on window
      if (typeof window.Razorpay !== 'undefined') {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'WeGrow Skill Campus & B School',
          description: feeType,
          order_id: orderData.orderId,
          image: '/wegrow-logo.webp',
          prefill: {
            name: studentName,
            email: studentEmail,
            contact: '+919876543210',
          },
          theme: {
            color: '#1d4ed8',
          },
          handler: async (response: any) => {
            try {
              // 3. Verify signature on backend
              const verifyRes = await api.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'mock_signature_success',
                amountInInr: amount,
                feeType,
              });

              onSuccess(verifyRes.data);
              onClose();
            } catch (vErr: any) {
              setError(vErr.message || 'Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (failResp: any) => {
          setError(failResp.error?.description || 'Payment transaction failed');
          setLoading(false);
        });
        rzp.open();
        setLoading(false);
      } else {
        // Fallback simulated payment for testing environments
        setTimeout(async () => {
          try {
            const verifyRes = await api.verifyRazorpayPayment({
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'mock_signature_success',
              amountInInr: amount,
              feeType,
            });
            onSuccess(verifyRes.data);
            onClose();
          } catch (vErr: any) {
            setError(vErr.message);
          } finally {
            setLoading(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Could not initiate checkout');
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>Razorpay Fee Checkout</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Instant, secure fee payment with automated tax receipt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              marginBottom: '16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label className="input-label">Payment Category</label>
            <select
              className="input-field"
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
            >
              <option value="Academic Term 2 Tuition & Activity Fee">Academic Term 2 Tuition & Activity Fee</option>
              <option value="Live Payment Verification Test (₹2)">Live Payment Verification Test (₹2)</option>
              <option value="Annual Examination & Lab Fee">Annual Examination & Lab Fee</option>
              <option value="Sports & Extracurricular Club Fee">Sports & Extracurricular Club Fee</option>
              <option value="Full Outstanding Academic Balance">Full Outstanding Academic Balance</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Amount (INR ₹)</label>
              <span style={{ fontSize: '11px', color: 'var(--primary-light)', fontWeight: 700 }}>Min ₹1 • Supported in Live Mode</span>
            </div>
            
            {/* Quick Amount Selector Chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setAmount(2);
                  setFeeType('Live Payment Verification Test (₹2)');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: amount === 2 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                  color: amount === 2 ? '#ffffff' : 'var(--primary-light)',
                  border: `1px solid ${amount === 2 ? 'var(--primary)' : 'var(--border-glass)'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                ⚡ ₹2 (Test Live Payment)
              </button>

              <button
                type="button"
                onClick={() => {
                  setAmount(10);
                  setFeeType('Live Payment Verification (₹10)');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: amount === 10 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                  color: amount === 10 ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${amount === 10 ? 'var(--primary)' : 'var(--border-glass)'}`,
                }}
              >
                ₹10
              </button>

              <button
                type="button"
                onClick={() => {
                  setAmount(100);
                  setFeeType('Part Tuition Installment (₹100)');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: amount === 100 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                  color: amount === 100 ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${amount === 100 ? 'var(--primary)' : 'var(--border-glass)'}`,
                }}
              >
                ₹100
              </button>

              <button
                type="button"
                onClick={() => {
                  setAmount(dueAmount > 0 ? dueAmount : 15000);
                  setFeeType('Academic Term 2 Tuition & Activity Fee');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: amount === (dueAmount > 0 ? dueAmount : 15000) ? 'var(--grad-blue)' : 'var(--bg-glass)',
                  color: amount === (dueAmount > 0 ? dueAmount : 15000) ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${amount === (dueAmount > 0 ? dueAmount : 15000) ? 'var(--primary)' : 'var(--border-glass)'}`,
                }}
              >
                ₹{(dueAmount > 0 ? dueAmount : 15000).toLocaleString('en-IN')} (Full Due)
              </button>
            </div>

            <input
              type="number"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              min={1}
            />
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--item-bg)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Student Name:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{studentName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Billing Email:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{studentEmail}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Gateway:</span>
              <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Razorpay Secure (UPI, Cards, NetBanking)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          
          {/* Quick Sandbox / Test Simulator Button */}
          <button
            id="btn-simulate-razorpay"
            className="btn btn-outline"
            onClick={async () => {
              try {
                setLoading(true);
                const res = await api.createRazorpayOrder({ amount, feeType });
                const orderData = res.data;
                const verifyRes = await api.verifyRazorpayPayment({
                  razorpay_order_id: orderData.orderId,
                  razorpay_payment_id: `pay_sim_${Date.now()}`,
                  razorpay_signature: 'mock_signature_success',
                  amountInInr: amount,
                  feeType,
                });
                onSuccess(verifyRes.data);
                onClose();
              } catch (err: any) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <Sparkles size={16} style={{ color: '#fbbf24' }} /> Instant Test Checkout (Sandbox)
          </button>

          <button
            id="btn-confirm-razorpay"
            className="btn btn-primary"
            onClick={handlePayNow}
            disabled={loading || amount <= 0}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <ShieldCheck size={18} /> Launch Razorpay SDK (₹{amount.toLocaleString('en-IN')})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
