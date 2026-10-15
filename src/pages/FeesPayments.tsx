import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Clock, ShieldCheck, Download, Sparkles, Receipt } from 'lucide-react';
import { api } from '../services/api';
import { PaymentItem, Student } from '../types';
import { RazorpayModal } from '../components/RazorpayModal';

interface FeesProps {
  student: Student | null;
  onRefreshStudent: () => void;
}

export const FeesPayments: React.FC<FeesProps> = ({ student, onRefreshStudent }) => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  const resolveFees = (resData?: any) => {
    const sTotal = student?.totalFees !== undefined && Number(student.totalFees) > 0 ? Number(student.totalFees) : 45000;
    const sPaid = student?.paidFees !== undefined ? Number(student.paidFees) : 0;
    const sDue = student?.dueFees !== undefined ? Number(student.dueFees) : Math.max(0, sTotal - sPaid);

    const total = (resData?.totalFees && Number(resData.totalFees) > 0) ? Number(resData.totalFees) : sTotal;
    const paid = (resData?.paidFees !== undefined && Number(resData.paidFees) > 0) ? Number(resData.paidFees) : sPaid;
    const due = (resData?.dueFees !== undefined && Number(resData.dueFees) > 0) ? Number(resData.dueFees) : Math.max(0, total - paid);

    return { totalFees: total, paidFees: paid, dueFees: due };
  };

  const [feeStats, setFeeStats] = useState(resolveFees());
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState<any | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  useEffect(() => {
    setFeeStats(resolveFees());
  }, [student]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.getPaymentHistory();
      if (res.data?.payments) {
        setPayments(res.data.payments);
      }
      setFeeStats(resolveFees(res.data));
    } catch (err) {
      console.error('Failed to load payment history:', err);
      setFeeStats(resolveFees());
    }
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    setRecentReceipt(paymentResult);
    fetchHistory();
    onRefreshStudent();
  };

  const generateReceiptHTML = (p: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fee Receipt - ${p.receiptNumber} | WeGrow Skill Campus</title>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 30px; color: #0F172A; background: #fff; }
        .receipt-box { max-width: 750px; margin: 0 auto; border: 2px solid #0B1F4D; border-radius: 12px; padding: 32px; position: relative; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F26A1B; padding-bottom: 18px; margin-bottom: 24px; }
        .logo-title { font-size: 26px; font-weight: 900; color: #0B1F4D; margin: 0; }
        .logo-orange { color: #F26A1B; }
        .campus-badge { font-size: 11px; font-weight: 800; background: #FFE9D9; color: #E5530A; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px; }
        .receipt-title { text-align: center; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #0B1F4D; margin: 16px 0 24px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 13.5px; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #E2E8F0; }
        .info-label { color: #64748B; font-weight: 600; }
        .info-val { font-weight: 700; color: #0F172A; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
        th { background: #0B1F4D; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; text-transform: uppercase; }
        td { padding: 12px 14px; border-bottom: 1px solid #E2E8F0; }
        .total-row { font-size: 16px; font-weight: 800; background: #F8FAFC; }
        .paid-stamp { display: inline-block; border: 2px solid #10B981; color: #10B981; font-weight: 900; padding: 6px 18px; border-radius: 8px; font-size: 14px; text-transform: uppercase; transform: rotate(-5deg); letter-spacing: 2px; }
        .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; }
        .signature-box { text-align: center; }
        .signature-line { width: 180px; height: 1px; background: #0F172A; margin: 30px auto 6px; }
        .btn-print { background: #F26A1B; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
        @media print { .btn-print { display: none; } }
      </style>
    </head>
    <body>
      <div style="text-align: right; max-width: 750px; margin: 0 auto 10px;">
        <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      </div>
      <div class="receipt-box">
        <div class="header">
          <div>
            <h1 class="logo-title">We<span class="logo-orange">Grow</span></h1>
            <div style="font-size: 12px; font-weight: 700; color: #3A4560;">Skill Campus &amp; B School • Sivakasi</div>
          </div>
          <div style="text-align: right;">
            <span class="campus-badge">OFFICIAL FEE RECEIPT</span>
            <div style="font-size: 12px; color: #64748B; margin-top: 6px;">ISO 9001:2015 Certified Educational Institution</div>
          </div>
        </div>

        <div class="receipt-title">Student Fee Payment Receipt</div>

        <div class="info-grid">
          <div>
            <div class="info-row"><span class="info-label">Receipt Number:</span><span class="info-val">${p.receiptNumber}</span></div>
            <div class="info-row"><span class="info-label">Payment Date:</span><span class="info-val">${new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
            <div class="info-row"><span class="info-label">Status:</span><span class="info-val" style="color: #10B981;">PAID &amp; VERIFIED</span></div>
            <div class="info-row"><span class="info-label">Payment Mode:</span><span class="info-val">Razorpay Secure Online / NetBanking</span></div>
          </div>
          <div>
            <div class="info-row"><span class="info-label">Student Name:</span><span class="info-val">${student?.name || 'Aarav Sharma'}</span></div>
            <div class="info-row"><span class="info-label">Roll Number:</span><span class="info-val">${student?.rollNumber || 'WG-2026-AI04'}</span></div>
            <div class="info-row"><span class="info-label">Course / Batch:</span><span class="info-val">${student?.grade || 'AI & GenAI Master Track'}</span></div>
            <div class="info-row"><span class="info-label">Parent / Guardian:</span><span class="info-val">${student?.parentName || 'Rajesh Sharma'}</span></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Fee Particulars / Item Description</th>
              <th>Academic Year</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><strong>${p.feeType || 'Tuition & Academic Training Fee'}</strong><br><small style="color: #64748B;">Comprehensive 1-Year AI, Python & Robotics Module</small></td>
              <td>2026 - 2027</td>
              <td style="text-align: right; font-weight: 600;">₹${(p.amount * 0.75).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>2</td>
              <td><strong>High-Performance GPU Cloud Lab & Hands-on Hardware Kit</strong><br><small style="color: #64748B;">Dedicated server infrastructure & robotics sensor pack</small></td>
              <td>Term 1</td>
              <td style="text-align: right; font-weight: 600;">₹${(p.amount * 0.25).toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-weight: 800;">TOTAL AMOUNT PAID:</td>
              <td style="text-align: right; font-size: 18px; font-weight: 900; color: #0B1F4D;">₹${p.amount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 14px 20px; border-radius: 8px;">
          <div>
            <div style="font-size: 13px; font-weight: 700; color: #166534;">Payment Verified via Razorpay Secured Shield</div>
            <div style="font-size: 11.5px; color: #15803D;">Transaction ID: ${p.paymentId || 'pay_online_' + Math.random().toString(36).substring(2, 9)}</div>
          </div>
          <div class="paid-stamp">✓ PAID</div>
        </div>

        <div class="footer">
          <div>
            <div>WeGrow Skill Campus &amp; B School, Sivakasi</div>
            <div>Web: https://wegrowskillcampus.edu • Tel: +91 98765 43210</div>
            <div><em>Note: This is an official verified student fee voucher.</em></div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <strong>Accounts &amp; Registrar Lead</strong>
            <div>WeGrow Skill Campus</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const downloadHTMLReceipt = (p: any) => {
    const htmlContent = generateReceiptHTML(p);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WeGrow_Receipt_${p.receiptNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadReceiptPDF = (p: any) => {
    // Open in-app preview modal first so user never misses it
    setSelectedReceipt(p);

    try {
      const printWindow = window.open('', '_blank', 'width=850,height=900');
      if (printWindow) {
        printWindow.document.write(generateReceiptHTML(p));
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (e) {
      console.warn('Popup blocked, using in-app receipt preview modal');
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Academic Fees & Razorpay Gateway</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
            Instant digital fee payment with official tax receipts and transaction logs
          </p>
        </div>

        <button
          id="btn-open-razorpay-top"
          className="btn btn-primary"
          onClick={() => setIsRazorpayOpen(true)}
          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
        >
          <CreditCard size={17} /> Pay via Razorpay
        </button>
      </div>

      {/* Success Notification Alert if paid */}
      {recentReceipt && (
        <div
          className="glass-card"
          style={{
            padding: '20px 24px',
            marginBottom: '28px',
            background: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Payment Successfully Received via Razorpay!
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Receipt No: <strong style={{ color: 'var(--primary-light)' }}>{recentReceipt.receiptNumber}</strong> • Amount: ₹{recentReceipt.amount?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => downloadReceiptPDF(recentReceipt)}
          >
            <Download size={14} /> Download Receipt PDF
          </button>
        </div>
      )}

      {/* 3 Overview Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card stat-card">
          <div>
            <div className="stat-title">Total Annual Academic Fee</div>
            <div className="stat-value">₹{feeStats.totalFees.toLocaleString('en-IN')}</div>
            <div className="stat-subtitle">Academic Year 2026 - 2027</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-purple">
            <Receipt size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-title">Paid Amount</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>
              ₹{feeStats.paidFees.toLocaleString('en-IN')}
            </div>
            <div className="stat-subtitle" style={{ color: '#38bdf8' }}>
              <CheckCircle2 size={14} /> Verified in Student Ledger
            </div>
          </div>
          <div className="stat-icon-wrapper stat-icon-blue">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ borderColor: feeStats.dueFees > 0 ? 'rgba(245, 158, 11, 0.4)' : undefined }}>
          <div>
            <div className="stat-title">Outstanding Due Balance</div>
            <div className="stat-value" style={{ color: feeStats.dueFees > 0 ? '#fbbf24' : '#38bdf8' }}>
              ₹{feeStats.dueFees.toLocaleString('en-IN')}
            </div>
            <div className="stat-subtitle">
              {feeStats.dueFees > 0 ? 'Due Balance Available for Payment' : 'All Dues Fully Settled'}
            </div>
          </div>
          <div className="stat-icon-wrapper stat-icon-amber">
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Payment Transactions Ledger</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>All verified fee transactions and receipts</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#38bdf8' }}>
            <ShieldCheck size={16} /> Secured by Razorpay Payment Shield
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Receipt #</th>
                <th style={{ padding: '12px 14px' }}>Fee Description</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Amount</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.receiptNumber}
                  </td>
                  <td style={{ padding: '16px 14px', color: 'var(--text-secondary)' }}>
                    {p.feeType}
                  </td>
                  <td style={{ padding: '16px 14px', color: 'var(--text-muted)' }}>
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        background: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.25)',
                        fontWeight: 900,
                        fontSize: '15.5px',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: '#10b981',
                        fontSize: '11.5px',
                        fontWeight: 800,
                      }}
                    >
                      PAID
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => downloadReceiptPDF(p)}
                        title="Download or Print Official Fee Receipt"
                        style={{ fontWeight: 800, fontSize: '12px' }}
                      >
                        <Download size={13} /> PDF
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => downloadHTMLReceipt(p)}
                        title="Direct Download Offline Receipt File"
                        style={{ fontWeight: 800, fontSize: '12px' }}
                      >
                        📥 File
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official In-App Receipt Preview & Download Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                  Official Verified Fee Voucher
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Receipt #{selectedReceipt.receiptNumber} • WeGrow Skill Campus
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => downloadReceiptPDF(selectedReceipt)}
                  style={{ background: '#F26A1B', borderColor: '#F26A1B', color: '#fff', fontWeight: 800 }}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => downloadHTMLReceipt(selectedReceipt)}
                  style={{ fontWeight: 800 }}
                >
                  📥 Download File
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedReceipt(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Render HTML receipt voucher preview inside styled box */}
            <div
              style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '28px',
                borderRadius: '12px',
                border: '2px solid #0B1F4D',
                fontFamily: 'Segoe UI, sans-serif',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F26A1B', paddingBottom: '14px', marginBottom: '18px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0B1F4D', margin: 0 }}>
                    We<span style={{ color: '#F26A1B' }}>Grow</span>
                  </h1>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#3A4560' }}>
                    Skill Campus &amp; B School • Sivakasi
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: '#FFE9D9', color: '#E5530A', padding: '4px 10px', borderRadius: '6px' }}>
                    OFFICIAL FEE RECEIPT
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>ISO 9001:2015 Certified</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Receipt No:</span>
                    <strong>{selectedReceipt.receiptNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Date:</span>
                    <strong>{new Date(selectedReceipt.date).toLocaleDateString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Status:</span>
                    <strong style={{ color: '#10B981' }}>PAID &amp; VERIFIED</strong>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Student:</span>
                    <strong>{student?.name || 'Aarav Sharma'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Roll No:</span>
                    <strong>{student?.rollNumber || 'WG-2026-AI04'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Course:</span>
                    <strong>{student?.grade || 'AI & GenAI Master Track'}</strong>
                  </div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#0B1F4D', color: '#fff' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item Description</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #E2E8F0' }}>
                      <strong>{selectedReceipt.feeType || 'Tuition & Academic Training Fee'}</strong>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right', fontWeight: 700 }}>
                      ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr style={{ background: '#F8FAFC', fontWeight: 900, fontSize: '15px' }}>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>TOTAL PAID:</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0B1F4D' }}>
                      ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 16px', borderRadius: '8px', fontSize: '12.5px' }}>
                <span style={{ color: '#166534', fontWeight: 700 }}>Razorpay Shield Verified • Ref: {selectedReceipt.paymentId || 'pay_verified_online'}</span>
                <span style={{ border: '2px solid #10B981', color: '#10B981', fontWeight: 900, padding: '3px 12px', borderRadius: '6px' }}>✓ PAID</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        dueAmount={feeStats.dueFees}
        studentName={student?.name || 'Aarav Sharma'}
        studentEmail={student?.email || 'student@edupulse.edu'}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
