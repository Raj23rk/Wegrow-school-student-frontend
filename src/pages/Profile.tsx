import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  MessageCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  CreditCard,
  Send,
  Camera,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { Student } from '../types';
import { useToast } from '../components/ToastContext';

interface ProfileProps {
  student: Student | null;
  onUpdateSuccess: (updated: Student) => void;
  onNotificationSent: (data: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ student, onUpdateSuccess, onNotificationSent }) => {
  const { toast } = useToast();
  const [name, setName] = useState(student?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(student?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(student?.address || 'Flat 402, Lotus Residency, Indiranagar, Bangalore, Karnataka - 560038');
  const [parentName, setParentName] = useState(student?.parentName || 'Rajesh Sharma');
  const [parentEmail, setParentEmail] = useState(student?.parentEmail || 'rajesh.parent@gmail.com');
  const [parentWhatsApp, setParentWhatsApp] = useState(student?.parentWhatsApp || '+919876543210');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [testingAlert, setTestingAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Please select a valid image file (PNG, JPG, WEBP)', 'Invalid File');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Image size exceeds 5MB limit. Please choose a smaller image.', 'File Too Large');
      return;
    }

    try {
      setUploadingAvatar(true);
      setSuccessMsg(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadAvatar(base64Data);
          onUpdateSuccess(res.student);
          const msg = 'Profile photo uploaded and updated successfully!';
          setSuccessMsg(msg);
          toast.success(msg, 'Avatar Updated');
        } catch (err: any) {
          toast.error(err.message || 'Failed to upload profile photo', 'Upload Error');
        } finally {
          setUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error(err.message || 'Error processing image file', 'File Error');
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);

      const res = await api.updateProfile({
        name,
        phone,
        address,
        parentName,
        parentEmail,
        parentWhatsApp,
      });

      const msg = 'Profile and Parent Notification destinations updated successfully!';
      setSuccessMsg(msg);
      toast.success(msg, 'Profile Saved');
      onUpdateSuccess(res.student);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile', 'Update Error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestAlert = async () => {
    try {
      setTestingAlert(true);
      // Simulate/trigger test score notification to parent WhatsApp & Email
      const res = await api.submitQuiz('quiz_001', {
        studentId: student?.id || 'std_001',
        answers: { q1: 0, q2: 1, q3: 0, q4: 1, q5: 1 },
        timeSpentSeconds: 300,
      });

      onNotificationSent({
        ...res.result.parentAlerts,
        score: res.result.score,
        totalMarks: res.result.totalMarks,
        quizTitle: 'Live Test Alert Verification',
      });

      const msg = 'Instant test notification successfully transmitted to Parent WhatsApp and Email!';
      setSuccessMsg(msg);
      toast.success(msg, 'Alert Dispatched');
    } catch (err: any) {
      toast.error('Notification test failed: ' + err.message, 'Test Failed');
    } finally {
      setTestingAlert(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Student Profile & Parent Alert Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
          Personal student credentials, profile photo, parent WhatsApp sync, and academic registration info
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAvatarFileChange}
      />

      {/* Main Student Card Banner */}
      <div
        className="glass-card"
        style={{
          padding: '32px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          border: '1px solid var(--border-glass)',
        }}
      >
        {/* Avatar with Camera Upload Overlay Button */}
        <div style={{ position: 'relative' }}>
          <img
            src={student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={name}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary)',
              boxShadow: '0 0 25px var(--primary-glow)',
            }}
          />

          <button
            type="button"
            id="btn-upload-avatar-icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload new profile photo"
            disabled={uploadingAvatar}
            style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary)',
              border: '2px solid var(--bg-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s ease',
            }}
          >
            {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          </button>
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>{student?.name}</h2>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Active Student
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 10px' }}>
            Roll Number: <strong style={{ color: '#38bdf8' }}>{student?.rollNumber}</strong> • Grade: <strong>{student?.grade} ({student?.section})</strong>
          </p>

          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> {student?.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} /> {phone}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          {/* Section 1: Student Information */}
          <div className="glass-card" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: 'var(--primary-light)' }} /> Student Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="input-label">Student Phone</label>
                <input
                  type="text"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="input-label">Residential Address</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parent WhatsApp & Email Alerts (CRITICAL) */}
          <div className="glass-card" style={{ padding: '26px', borderColor: 'rgba(37, 211, 102, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366' }}>
                <MessageCircle size={18} /> Parent Notification Alerts
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#25D366',
                  background: 'rgba(37, 211, 102, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                Instant Sync
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Test marks, scores, and daily notifications are immediately routed to these channels
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Parent / Guardian Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={14} style={{ color: '#25D366' }} /> Parent WhatsApp Mobile Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={parentWhatsApp}
                  onChange={(e) => setParentWhatsApp(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Include country code for automated WhatsApp message delivery
                </span>
              </div>

              <div>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} style={{ color: 'var(--primary-light)' }} /> Parent Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@gmail.com"
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Receives official HTML scorecard upon quiz submission
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSendTestAlert}
            disabled={testingAlert}
          >
            <Send size={15} style={{ color: '#25D366' }} />
            {testingAlert ? 'Dispatching...' : 'Test WhatsApp & Email Notification Now'}
          </button>

          <button
            id="btn-save-profile"
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ padding: '12px 28px' }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
