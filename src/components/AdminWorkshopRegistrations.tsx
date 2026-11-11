import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Share2,
  ExternalLink,
  Phone,
  Mail,
  School,
  Sparkles,
  Calendar,
  X,
  FileSpreadsheet,
  Copy,
} from 'lucide-react';
import { api } from '../services/api';
import { WorkshopRegistration, WorkshopStats } from '../types';

export const AdminWorkshopRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [stats, setStats] = useState<WorkshopStats>({
    totalRegistrations: 0,
    paidRegistrations: 0,
    pendingRegistrations: 0,
    totalRevenue: 0,
    todayRegistrations: 0,
    workshopDate: '28 November 2026',
    workshopTime: '5:00 PM – 7:00 PM',
    ticketPrice: 99,
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [copySuccess, setCopySuccess] = useState(false);

  // Modals
  const [selectedTicket, setSelectedTicket] = useState<WorkshopRegistration | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualSchool, setManualSchool] = useState('');
  const [manualGrade, setManualGrade] = useState('Class 9 - 10 (High School)');
  const [manualCity, setManualCity] = useState('');
  const [manualStatus, setManualStatus] = useState<'paid' | 'pending'>('paid');
  const [savingManual, setSavingManual] = useState(false);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkshopRegistrations({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
      });

      if (res && res.success) {
        setRegistrations(res.registrations || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load workshop registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRegistrations();
  };

  const handleMarkPaid = async (regId: string) => {
    if (!window.confirm(`Mark registration ${regId} as Paid?`)) return;
    try {
      const res = await api.markWorkshopPaid(regId);
      if (res && res.success) {
        loadRegistrations();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  const handleDelete = async (regId: string) => {
    if (!window.confirm(`Are you sure you want to remove registration ${regId}?`)) return;
    try {
      const res = await api.deleteWorkshopRegistration(regId);
      if (res && res.success) {
        loadRegistrations();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete registration');
    }
  };

  const handleExportCSV = () => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || 'https://wegrow-school-backend.onrender.com/api';
    window.open(`${backendUrl}/workshop/export-csv`, '_blank');
  };

  const handleCopyPhoneNumbers = () => {
    const phones = registrations
      .map((r) => r.phone?.trim())
      .filter((p) => p && p.length >= 10);
    const uniquePhones = Array.from(new Set(phones)).join(', ');

    if (!uniquePhones) {
      alert('No phone numbers available to copy.');
      return;
    }

    navigator.clipboard.writeText(uniquePhones);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleSaveManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      alert('Student name and phone number are required.');
      return;
    }

    setSavingManual(true);
    try {
      const res = await api.createWorkshopManualRegistration({
        studentName: manualName.trim(),
        phone: manualPhone.trim(),
        email: manualEmail.trim(),
        schoolName: manualSchool.trim(),
        grade: manualGrade.trim(),
        city: manualCity.trim(),
        paymentStatus: manualStatus,
      });

      if (res && res.success) {
        setShowAddModal(false);
        setManualName('');
        setManualPhone('');
        setManualEmail('');
        setManualSchool('');
        setManualCity('');
        loadRegistrations();
      } else {
        alert(res?.message || 'Failed to save manual registration');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save manual registration');
    } finally {
      setSavingManual(false);
    }
  };

  // Filter list in frontend for instantaneous search
  const filteredRegistrations = registrations.filter((r) => {
    if (statusFilter !== 'all' && r.paymentStatus !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.studentName && r.studentName.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.schoolName && r.schoolName.toLowerCase().includes(q)) ||
      (r.registrationId && r.registrationId.toLowerCase().includes(q)) ||
      (r.city && r.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header - Crisp Light WeGrow Theme */}
      <div className="bg-gradient-to-r from-[#FFF8EF] via-[#FFF3EA] to-[#FFEFE2] border-2 border-orange-200/90 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-xs font-black tracking-wide uppercase mb-2">
              <Sparkles size={13} className="text-orange-500" />
              Special Workshop Manager
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F4D] flex items-center gap-2">
              WebSpark AI Workshop Registrations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Live school student participants, Razorpay fee collections (₹99), and attendee roster for{' '}
              <strong className="text-orange-600 font-extrabold">28 November 2026</strong> (5:00 PM – 7:00 PM).
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-[#E5530A] hover:from-[#E5530A] hover:to-orange-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Plus size={15} /> Add Student Offline
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition cursor-pointer"
              title="Download CSV Spreadsheet"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>

            <button
              onClick={handleCopyPhoneNumbers}
              className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition cursor-pointer"
              title="Copy WhatsApp numbers for bulk broadcast"
            >
              <Copy size={15} /> {copySuccess ? 'Copied!' : 'Copy Numbers'}
            </button>

            <button
              onClick={loadRegistrations}
              disabled={loading}
              className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 p-2.5 rounded-xl border border-slate-200 shadow-sm transition disabled:opacity-50 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards - High Contrast Light Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalRegistrations}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Students from various schools</span>
        </div>

        {/* Paid Registrations */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Paid Participants</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats.paidRegistrations}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">Confirmed seats with ₹99 fee</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-orange-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Collections</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F26A1B]">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-orange-700 mt-1 block font-medium">₹99 &times; {stats.paidRegistrations} paid seats</span>
        </div>

        {/* Pending / Incomplete */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Payments</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {stats.pendingRegistrations}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Checkout drop-offs / pending</span>
        </div>
      </div>

      {/* Toolbar: Search & Status Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, school, phone..."
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
          />
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({stats.totalRegistrations})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            Paid ({stats.paidRegistrations})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            Pending ({stats.pendingRegistrations})
          </button>
        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Reg ID</th>
                <th className="py-3.5 px-4">Student &amp; School</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Grade &amp; City</th>
                <th className="py-3.5 px-4">Fee / Status</th>
                <th className="py-3.5 px-4">Payment Ref</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-sm text-slate-700">No workshop registrations found</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      New students submitting the ₹99 workshop form will appear here in real time.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const isPaid = reg.paymentStatus === 'paid';
                  return (
                    <tr
                      key={reg.registrationId}
                      className="hover:bg-orange-50/40 transition"
                    >
                      {/* Registration ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60 inline-block">
                          {reg.registrationId}
                        </span>
                      </td>

                      {/* Student & School */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {reg.studentName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {reg.schoolName}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <Phone size={12} className="text-emerald-500 shrink-0" />
                          <span>{reg.phone}</span>
                          <a
                            href={`https://wa.me/91${reg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${reg.studentName}, regarding your WebSpark AI Workshop seat (${reg.registrationId})...`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 ml-1"
                            title="Open WhatsApp Chat"
                          >
                            <Share2 size={11} />
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[180px] mt-0.5">
                          <Mail size={11} className="shrink-0 text-slate-400" />
                          <span>{reg.email}</span>
                        </div>
                      </td>

                      {/* Grade & City */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {reg.grade}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {reg.city || 'Tamil Nadu'}
                        </div>
                      </td>

                      {/* Fee / Status */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-sm">
                          ₹{reg.amount || 99}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase mt-1 ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>

                      {/* Payment Ref */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-700 block truncate max-w-[130px]">
                          {reg.razorpayPaymentId || '—'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {reg.paymentMethod || 'Razorpay'}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-600 font-medium whitespace-nowrap">
                        {reg.registeredAt
                          ? new Date(reg.registeredAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTicket(reg)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                            title="View Ticket / Admission Pass"
                          >
                            Pass
                          </button>

                          {!isPaid && (
                            <button
                              onClick={() => handleMarkPaid(reg.registrationId)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-bold transition cursor-pointer"
                              title="Mark as Paid Manually"
                            >
                              <Check size={13} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(reg.registrationId)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Admission Ticket Preview & Print Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-2 border-orange-300 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest block">
                Official Workshop Pass
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1F4D] mt-1">
                {selectedTicket.workshopName || 'WebSpark AI Workshop'}
              </h2>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Status: {selectedTicket.paymentStatus.toUpperCase()} (₹{selectedTicket.amount || 99})
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs mb-6">
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Registration ID:</span>
                <span className="font-mono font-black text-orange-600 text-sm">
                  {selectedTicket.registrationId}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedTicket.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">School / College:</span>
                <span className="font-semibold text-slate-800">{selectedTicket.schoolName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Class / Grade:</span>
                <span className="font-semibold text-slate-800">{selectedTicket.grade}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Phone / WhatsApp:</span>
                <span className="font-bold text-emerald-600">{selectedTicket.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-semibold text-slate-800">{selectedTicket.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Date &amp; Time:</span>
                <span className="font-bold text-orange-600">28 Nov 2026, 5:00 - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment ID:</span>
                <span className="font-mono text-slate-700">
                  {selectedTicket.razorpayPaymentId || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition cursor-pointer"
              >
                <Download size={14} /> Print Pass
              </button>
              <a
                href={`https://wa.me/91${selectedTicket.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${selectedTicket.studentName}! Your WebSpark AI Workshop Pass (${selectedTicket.registrationId}) is confirmed for 28 Nov 2026 5:00 PM.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Share2 size={14} /> Send Pass to WA
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Manual Registration */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border-2 border-orange-300 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <h3 className="text-xl font-black text-[#0B1F4D]">Add Offline / Direct Participant</h3>
              <p className="text-xs text-slate-500 mt-1">
                Record a student who registered via cash, phone call, or school counter for ₹99.
              </p>
            </div>

            <form onSubmit={handleSaveManualRegistration} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. R. Ananthakumar"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">School / College Name</label>
                <input
                  type="text"
                  value={manualSchool}
                  onChange={(e) => setManualSchool(e.target.value)}
                  placeholder="e.g. Sivakasi Hindu Nadar Girls HSS"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={manualGrade}
                    onChange={(e) => setManualGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl px-3 py-2.5 text-slate-900 outline-none"
                  >
                    <option value="Class 6 - 8 (Middle School)">Class 6 - 8</option>
                    <option value="Class 9 - 10 (High School)">Class 9 - 10</option>
                    <option value="Class 11 - 12 (Higher Secondary)">Class 11 - 12</option>
                    <option value="College / Diploma Student">College / Diploma</option>
                    <option value="Other / Beginner">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    placeholder="Sivakasi"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="manual_status"
                      checked={manualStatus === 'paid'}
                      onChange={() => setManualStatus('paid')}
                      className="accent-emerald-500"
                    />
                    <span className="text-emerald-700 font-bold">Paid (₹99 Collected)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="manual_status"
                      checked={manualStatus === 'pending'}
                      onChange={() => setManualStatus('pending')}
                      className="accent-amber-500"
                    />
                    <span className="text-amber-700 font-bold">Pending (Unpaid)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingManual}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-[#E5530A] hover:from-[#E5530A] hover:to-orange-500 text-white font-extrabold py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {savingManual ? 'Saving...' : 'Save Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkshopRegistrations;

