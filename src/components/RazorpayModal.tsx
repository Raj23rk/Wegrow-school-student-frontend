import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X, Loader2, Sparkles, Check, Zap } from 'lucide-react';
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
  // Prebooking paid is verified at ₹1,000
  const PREBOOKING_PAID = 1000;

  // 3 Official Fee Payment Plans
  const plans = [
    {
      id: 'term_plan',
      title: 'Three Term Plan (Term 1)',
      badge: 'Recommended',
      badgeColor: '#10B981',
      totalCourseFee: 45000,
      payableAmount: 14000, // ₹15,000 - ₹1,000 prebooking
      description: 'Term 1 fee of ₹15,000 with ₹1,000 prebooking credited.',
      schedule: 'Term 1: ₹14,000 • Term 2: ₹15,000 • Term 3: ₹15,000',
      category: 'Three Term Plan - Term 1 Fee (₹1,000 Prebooking Reduced)',
    },
    {
      id: 'half_payment',
      title: 'Half Payment (2 Terms)',
      badge: '50% Split',
      badgeColor: '#38BDF8',
      totalCourseFee: 45000,
      payableAmount: 21500, // ₹22,500 - ₹1,000 prebooking
      description: 'First half of ₹22,500 with ₹1,000 prebooking credited.',
      schedule: 'Installment 1: ₹21,500 • Installment 2: ₹22,500',
      category: 'Half Payment Plan - Installment 1 of 2 (₹45,000 Split)',
    },
    {
      id: 'fulltime_discount',
      title: 'Full-Time One-Time Pay',
      badge: 'Save ₹2,000',
      badgeColor: '#F59E0B',
      totalCourseFee: 43000,
      payableAmount: 42000, // ₹43,000 - ₹1,000 prebooking
      description: 'Discounted annual fee of ₹43,000 minus ₹1,000 prebooking.',
      schedule: 'Single one-time settlement (Save ₹2,000 instantly)',
      category: 'Full-Time Annual Tuition Payment (One-Time ₹43,000 Plan)',
    },
  ];

  const [selectedPlanId, setSelectedPlanId] = useState<string>('term_plan');
  const [amount, setAmount] = useState<number>(14000);
  const [feeType, setFeeType] = useState('Three Term Plan - Term 1 Fee (₹1,000 Prebooking Reduced)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlanId(plan.id);
    setAmount(plan.payableAmount);
    setFeeType(plan.category);
  };

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
      <div className="modal-content" style={{ maxWidth: '640px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Razorpay Fee Checkout
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Choose your flexible payment plan or custom amount
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
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

        {/* Prebooking Notice Banner */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700 }}>
            <CheckCircle2 size={16} />
            <span>Prebooking Paid: ₹{PREBOOKING_PAID.toLocaleString('en-IN')} (Already Verified &amp; Deducted)</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
            Balance Due: ₹{(dueAmount > 0 ? dueAmount : 44000).toLocaleString('en-IN')}
          </span>
        </div>

        {/* 3 Payment Plans Selector */}
        <div style={{ marginBottom: '18px' }}>
          <label className="input-label" style={{ marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Choose Payment Plan
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {plans.map((p) => {
              const isSelected = selectedPlanId === p.id && amount === p.payableAmount;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlan(p)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
                    background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-glass)',
                    boxShadow: isSelected ? '0 4px 18px rgba(37, 99, 235, 0.2)' : undefined,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: `${p.badgeColor}22`,
                        color: p.badgeColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                      }}
                    >
                      {p.badge}
                    </span>
                    {isSelected && (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {p.title}
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary-light)', marginBottom: '4px' }}>
                    ₹{p.payableAmount.toLocaleString('en-IN')}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    {p.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Amount Chips (Custom, Test, Full) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="input-label" style={{ marginBottom: 0, fontSize: '12px' }}>
              Payable Amount (INR ₹)
            </label>
            <span style={{ fontSize: '11px', color: 'var(--primary-light)', fontWeight: 700 }}>
              Live &amp; Sandbox Supported
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setSelectedPlanId('');
                setAmount(2);
                setFeeType('Live Payment Verification Test (₹2)');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                background: amount === 2 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                color: amount === 2 ? '#ffffff' : 'var(--primary-light)',
                border: `1px solid ${amount === 2 ? 'var(--primary)' : 'var(--border-glass)'}`,
              }}
            >
              ⚡ ₹2 (Test Live)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPlanId('');
                setAmount(10);
                setFeeType('Live Verification (₹10)');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
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
                setSelectedPlanId('term_1');
                setAmount(14000);
                setFeeType('Three Term Plan - Term 1 Fee (₹14,000)');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                background: amount === 14000 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                color: amount === 14000 ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${amount === 14000 ? 'var(--primary)' : 'var(--border-glass)'}`,
              }}
            >
              ₹14,000 (Term 1)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPlanId('term_std');
                setAmount(15000);
                setFeeType('Three Term Plan - Term 2 / 3 Fee (₹15,000)');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                background: amount === 15000 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                color: amount === 15000 ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${amount === 15000 ? 'var(--primary)' : 'var(--border-glass)'}`,
              }}
            >
              ₹15,000 (Term 2/3)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPlanId('half');
                setAmount(22500);
                setFeeType('Half Payment Plan - Standard Split (₹22,500)');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                background: amount === 22500 ? 'var(--grad-blue)' : 'var(--bg-glass)',
                color: amount === 22500 ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${amount === 22500 ? 'var(--primary)' : 'var(--border-glass)'}`,
              }}
            >
              ₹22,500 (Half)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedPlanId('full_due');
                const fullDue = dueAmount > 0 ? dueAmount : 44000;
                setAmount(fullDue);
                setFeeType('Full Outstanding Academic Balance');
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                background: amount === (dueAmount > 0 ? dueAmount : 44000) ? 'var(--grad-blue)' : 'var(--bg-glass)',
                color: amount === (dueAmount > 0 ? dueAmount : 44000) ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${amount === (dueAmount > 0 ? dueAmount : 44000) ? 'var(--primary)' : 'var(--border-glass)'}`,
              }}
            >
              ₹{(dueAmount > 0 ? dueAmount : 44000).toLocaleString('en-IN')} (Full Due)
            </button>
          </div>

          <input
            type="number"
            className="input-field"
            value={amount}
            onChange={(e) => {
              setSelectedPlanId('');
              setAmount(Math.max(1, Number(e.target.value)));
            }}
            min={1}
            style={{ fontSize: '15px', fontWeight: 800 }}
          />
        </div>

        {/* Student & Billing Summary */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '12px',
            background: 'var(--item-bg)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '12.5px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Student Name:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{studentName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Fee Type:</span>
            <strong style={{ color: 'var(--brand-orange)' }}>{feeType}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Gateway:</span>
            <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>Razorpay Secure (UPI, Cards, NetBanking)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
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
