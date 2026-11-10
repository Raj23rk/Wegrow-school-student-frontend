import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Laptop,
  Phone,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  ChevronRight,
  Award,
  Globe,
  Code,
  Rocket,
  Zap,
  ArrowLeft,
  User,
  Mail,
  School,
  MapPin,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { WorkshopRegistration } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface WorkshopRegistrationViewProps {
  onBackToHome?: () => void;
  onNavigateLogin?: () => void;
}

export const WorkshopRegistrationView: React.FC<WorkshopRegistrationViewProps> = ({
  onBackToHome,
  onNavigateLogin,
}) => {
  // Form State
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('Class 9 - 10 (High School)');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const paymentAmount = 99; // Official Workshop Pass Fee (₹99)

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedTicket, setConfirmedTicket] = useState<WorkshopRegistration | null>(null);

  const workshopDetails = {
    title: 'WebSpark AI',
    subheading: 'AI Website Building Workshop',
    tagline: 'Build Your Own Website with AI!',
    fee: 99,
    date: '28 November 2026',
    time: '5:00 PM – 7:00 PM',
    mode: 'Online Workshop',
    helpline: '93443 37331',
    features: [
      { icon: Globe, text: 'Build a real website with AI', color: '#2563EB' },
      { icon: Code, text: 'No coding needed', color: '#DC2626' },
      { icon: Laptop, text: 'Live, hands-on learning', color: '#059669' },
      { icon: Rocket, text: 'Publish your own website live', color: '#7C3AED' },
      { icon: Award, text: 'Official Certificate of Participation', color: '#D97706' },
      { icon: Zap, text: 'Free AI Website Templates & Prompts', color: '#F59E0B' },
    ],
  };

  const fireCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F26A1B', '#FFC21A', '#00E5FF', '#10B981', '#8B3FD9'],
    });
  };

  const scrollToForm = () => {
    const el = document.getElementById('registration-form-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Form Submission & Razorpay Checkout
  const handleProceedPayment = async (isSimulation = false) => {
    setErrorMsg('');

    // Validation
    if (!studentName.trim()) {
      setErrorMsg('Please enter the student / participant full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp / mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address to receive admission pass & workshop link.');
      return;
    }
    if (!schoolName.trim()) {
      setErrorMsg('Please enter the school or college name.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order via Backend for Official Workshop Pass (₹99)
      const orderRes = await api.createWorkshopOrder({
        studentName: studentName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        schoolName: schoolName.trim(),
        grade: grade.trim(),
        city: city.trim() || 'Tamil Nadu',
        notes: notes.trim(),
        amount: paymentAmount,
      });

      if (!orderRes || !orderRes.success) {
        throw new Error(orderRes?.message || 'Failed to initiate workshop order.');
      }

      const orderData = orderRes.data;

      // 2. If Simulation or Razorpay SDK not loaded on window
      if (isSimulation || typeof window.Razorpay === 'undefined') {
        const simPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await api.verifyWorkshopPayment({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: 'mock_signature_success',
          registrationId: orderData.registrationId,
          studentName: studentName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          schoolName: schoolName.trim(),
          grade,
          city,
          amount: paymentAmount,
        });

        if (verifyRes && verifyRes.success) {
          setConfirmedTicket(verifyRes.data);
          fireCelebration();
        } else {
          throw new Error(verifyRes?.message || 'Verification failed');
        }
        setLoading(false);
        return;
      }

      // 3. Launch Live Razorpay Checkout
      const options = {
        key: orderData.keyId || 'rzp_live_TnMVbzGus2s2u0',
        amount: orderData.amount || paymentAmount * 100, // 9900 paise for ₹99
        currency: orderData.currency || 'INR',
        name: 'WeGrow Skill Campus & B School',
        description: 'WebSpark AI - AI Website Building Workshop (Fee: ₹99)',
        image: '/wegrow-logo.webp',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            setLoading(true);
            const verifyRes = await api.verifyWorkshopPayment({
              razorpay_order_id: response.razorpay_order_id || orderData.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'mock_signature_success',
              registrationId: orderData.registrationId,
              studentName: studentName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              schoolName: schoolName.trim(),
              grade,
              city,
              amount: paymentAmount,
            });

            if (verifyRes && verifyRes.success) {
              setConfirmedTicket(verifyRes.data);
              fireCelebration();
            } else {
              setErrorMsg(verifyRes?.message || 'Payment verification failed. Please contact helpline.');
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Payment verification encountered an issue.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: studentName,
          email: email,
          contact: phone,
        },
        notes: {
          registrationId: orderData.registrationId,
          school: schoolName,
          workshop: 'WebSpark AI Workshop',
        },
        theme: {
          color: '#F26A1B',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failRes: any) => {
        setErrorMsg(failRes?.error?.description || 'Razorpay payment was not completed.');
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Registration order error:', err);
      setErrorMsg(err.message || 'Could not complete registration. Please check connection.');
      setLoading(false);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061430] via-[#0C2152] to-[#040E24] text-slate-100 font-sans antialiased relative overflow-x-hidden pb-20 md:pb-12">
      {/* Decorative Ambient Glow Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/15 via-amber-400/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#071738]/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/15 transition cursor-pointer"
          >
            <ArrowLeft size={13} /> <span className="hidden xs:inline">Back to</span> Portal
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black tracking-wider text-orange-400 uppercase">
              WeGrow Skill Campus
            </span>
            <span className="text-[10px] text-amber-300 font-bold hidden sm:inline">&bull; AI Lab</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${workshopDetails.helpline}`}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-yellow-300 bg-yellow-400/15 hover:bg-yellow-400/25 px-2.5 sm:px-3 py-1.5 rounded-lg border border-yellow-400/30 transition whitespace-nowrap"
          >
            <Phone size={12} /> <span className="hidden sm:inline">Helpline:</span> {workshopDetails.helpline}
          </a>
          {onNavigateLogin && (
            <button
              onClick={onNavigateLogin}
              className="text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-3 py-1.5 rounded-lg shadow-sm transition whitespace-nowrap cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        {/* If payment is confirmed, show Ticket / Pass View */}
        {confirmedTicket ? (
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0B1F4D] to-[#122A63] border-2 border-orange-500/40 rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Background Accent Rings */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Success Header */}
            <div className="text-center relative z-10 mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full mb-3 sm:mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle size={36} className="text-emerald-400" />
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-full border border-emerald-500/40 mb-2">
                Registration Confirmed &bull; Seat Booked
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white">
                You&apos;re Officially Registered!
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Payment of <strong className="text-emerald-300">₹{confirmedTicket.amount || paymentAmount}</strong> received via Razorpay. Your seat is confirmed!
              </p>
            </div>

            {/* Official Admission Pass Card */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 relative z-10 backdrop-blur-md mb-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                    WeGrow Official Pass
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">{workshopDetails.title}</h3>
                  <p className="text-[11px] sm:text-xs text-orange-300">{workshopDetails.subheading}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] sm:text-[10px] text-slate-300 block uppercase font-bold">Registration ID</span>
                  <span className="text-sm sm:text-lg font-black text-yellow-300 tracking-wider font-mono">
                    {confirmedTicket.registrationId}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-300 block font-medium">Participant Name:</span>
                  <span className="text-white font-bold text-sm">{confirmedTicket.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-300 block font-medium">Grade / Class:</span>
                  <span className="text-white font-bold text-sm">{confirmedTicket.grade || grade}</span>
                </div>
                <div>
                  <span className="text-slate-300 block font-medium">School / College:</span>
                  <span className="text-white font-semibold">{confirmedTicket.schoolName}</span>
                </div>
                <div>
                  <span className="text-slate-300 block font-medium">WhatsApp / Mobile:</span>
                  <span className="text-emerald-300 font-bold">{confirmedTicket.phone}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-300 block font-medium">Workshop Date:</span>
                    <span className="text-orange-300 font-extrabold text-xs sm:text-sm">{workshopDetails.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-300 block font-medium">Time (IST):</span>
                    <span className="text-yellow-300 font-extrabold text-xs sm:text-sm">{workshopDetails.time}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-black text-emerald-300 uppercase tracking-wider">
                    Paid ₹{confirmedTicket.amount || paymentAmount} &bull; Razorpay Verified
                  </span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono">
                  Ref: {confirmedTicket.razorpayPaymentId || 'pay_online_confirmed'}
                </span>
              </div>
            </div>

            {/* Quick Next Steps Banner */}
            <div className="bg-orange-500/20 border border-orange-500/35 rounded-xl p-3.5 mb-6 relative z-10 text-xs text-orange-100 leading-relaxed">
              <strong className="text-orange-300 block mb-1 font-bold">📲 What Happens Next:</strong>
              1. A confirmation receipt has been dispatched to your email &amp; WhatsApp.<br />
              2. The live meeting link (Google Meet / Zoom) will be sent to your WhatsApp 2 hours before 5:00 PM on 28th Nov.<br />
              3. Keep your laptop/desktop ready with Chrome browser.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <a
                href={`https://wa.me/919344337331?text=${encodeURIComponent(
                  `Hi WeGrow! I have registered for WebSpark AI Workshop. My Reg ID is ${confirmedTicket.registrationId}. Please add me to the workshop WhatsApp group.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <Share2 size={16} /> Join WhatsApp Support Group
              </a>

              <button
                onClick={handlePrintTicket}
                className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-white/25 transition cursor-pointer"
              >
                <Download size={16} /> Print / Save Pass
              </button>
            </div>

            <div className="text-center mt-5">
              <button
                onClick={() => setConfirmedTicket(null)}
                className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
              >
                Register another student
              </button>
            </div>
          </div>
        ) : (
          /* Main Workshop & Registration Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Workshop Details & Visual Poster */}
            <div className="lg:col-span-6 space-y-5">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-full text-orange-300 text-xs font-black tracking-wide uppercase">
                <Sparkles size={13} className="text-yellow-400" />
                Live AI Website Building Workshop for School Students
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  WebSpark{' '}
                  <span
                    style={{
                      color: '#FFC21A',
                      textShadow: '0 0 25px rgba(255, 194, 26, 0.45)',
                    }}
                  >
                    AI
                  </span>
                </h1>
                <p className="text-base sm:text-xl font-bold text-amber-300 mt-0.5">
                  AI Website Building Workshop
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-xl bg-orange-500/20 border border-orange-500/30 text-white font-extrabold text-sm sm:text-base">
                  ⚡ Build Your Own Website with AI!
                </div>
              </div>

              {/* Official Workshop Visual Poster Card - Clean Framed */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 hover:border-orange-400/50 shadow-2xl bg-white transition duration-300">
                <img
                  src="/webspark-ai-workshop.jpg"
                  alt="WebSpark AI - AI Website Building Workshop Poster"
                  className="w-full h-auto object-cover block"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Schedule Highlights Bar (Date, Time, Mode) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/10 border border-white/15 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500/25 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase block">Date</span>
                    <span className="text-[11px] sm:text-xs font-black text-white whitespace-nowrap">
                      {workshopDetails.date}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-yellow-500/25 border border-yellow-500/40 flex items-center justify-center text-yellow-300 shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase block">Time</span>
                    <span className="text-[11px] sm:text-xs font-black text-white whitespace-nowrap">
                      5:00 - 7:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/25 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                    <Laptop size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase block">Mode</span>
                    <span className="text-[11px] sm:text-xs font-black text-white whitespace-nowrap">
                      Online Live
                    </span>
                  </div>
                </div>
              </div>

              {/* What You Will Learn List */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} className="text-yellow-400" />
                  What Students Learn in 2 Hours:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {workshopDetails.features.map((feat, idx) => {
                    const IconComp = feat.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10"
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${feat.color}25` }}
                        >
                          <IconComp size={14} style={{ color: feat.color }} />
                        </div>
                        <span className="text-slate-100 font-semibold text-[11px] sm:text-xs">{feat.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile CTA Helper */}
              <div className="block lg:hidden text-center pt-1">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register Now for ₹99</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Column: High-Contrast Crisp White Registration Form Card */}
            <div className="lg:col-span-6" id="registration-form-card">
              <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-orange-500/20 relative">
                {/* Form Header */}
                <div className="border-b border-slate-200 pb-4 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black tracking-widest text-[#F26A1B] uppercase">
                      Official Registration
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                      ⚡ Seat Fee: ₹99 Only
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B1F4D]">
                    Register for WebSpark AI
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill the details below to secure your live workshop seat &amp; receive admission ticket.
                  </p>
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div className="mb-4 bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    <span className="font-semibold">{errorMsg}</span>
                  </div>
                )}

                {/* Form Fields - 100% Crisp White Backgrounds (Never Clashes with Autofill) */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProceedPayment(false);
                  }}
                  className="space-y-4"
                >
                  {/* Student Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Full Name <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Sujay Sarvesh R.B"
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border-2 border-slate-200 focus:border-[#F26A1B] focus:ring-4 focus:ring-orange-500/15 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-[15px] sm:text-sm font-semibold transition outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number & Email in 2 columns on desktop, 1 column on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp / Mobile No. <span className="text-orange-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          maxLength={12}
                          className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border-2 border-slate-200 focus:border-[#F26A1B] focus:ring-4 focus:ring-orange-500/15 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-[15px] sm:text-sm font-semibold transition outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Joining link sent to this WhatsApp</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-orange-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@gmail.com"
                          className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border-2 border-slate-200 focus:border-[#F26A1B] focus:ring-4 focus:ring-orange-500/15 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-[15px] sm:text-sm font-semibold transition outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">For digital pass &amp; certificate</span>
                    </div>
                  </div>

                  {/* School / College Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School / College Name <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Wisdom Wealth International School"
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border-2 border-slate-200 focus:border-[#F26A1B] focus:ring-4 focus:ring-orange-500/15 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-[15px] sm:text-sm font-semibold transition outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Grade / Class & City in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Class / Standard <span className="text-orange-600">*</span>
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border-2 border-slate-200 focus:border-[#F26A1B] focus:ring-4 focus:ring-orange-500/15 rounded-xl px-3 py-2.5 sm:py-3 text-[15px] sm:text-sm font-semibold transition outline-none"
                      >
                        <option value="Class 6 - 8 (Middle School)">Class 6 - 8 (Middle School)</option>
                        <option value="Class 9 - 10 (High School)">Class 9 - 10 (High School)</option>
                        <option value="Class 11 - 12 (Higher Secondary)">Class 11 - 12 (Higher Secondary)</option>
                        <option value="College / Diploma Student">College / Diploma Student</option>
                        <option value="Parent Registering for Child">Parent Registering for Child</option>
                        <option value="Other / AI Enthusiast">Other / AI Enthusiast</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City / Location
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Sivakasi / Virudhunagar"
                          className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border-2 border-slate-200 focus:border-[#F26A1B] focus:ring-4 focus:ring-orange-500/15 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-[15px] sm:text-sm font-semibold transition outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown Box - Clean Warm Card */}
                  <div className="bg-[#FFF9F3] border-2 border-[#FFE3C7] rounded-2xl p-4 my-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                      <span>Standard Workshop Pass:</span>
                      <span className="line-through text-slate-400 font-semibold">₹499</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span>Student Early-Bird Subsidy:</span>
                      <span className="text-emerald-700 font-black">- ₹400</span>
                    </div>
                    <div className="h-px bg-[#FED7AA] my-2" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-[#0B1F4D] uppercase block">
                          Total Payable Now:
                        </span>
                        <span className="text-[10px] text-slate-500">2-hour live hands-on + certificate</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black text-[#F26A1B]">₹99</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Razorpay Checkout Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#F26A1B] via-[#E5530A] to-[#FF9800] hover:from-[#E5530A] hover:to-[#F26A1B] text-white font-black py-3.5 sm:py-4 px-6 rounded-2xl text-base shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay Secure Gateway...</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck size={20} className="text-yellow-300" />
                        <span>Pay ₹99 &amp; Confirm Workshop Seat</span>
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>

                  {/* Instant Demo Test Mode Link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleProceedPayment(true)}
                      className="text-[11px] text-slate-500 hover:text-orange-600 transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Zap size={12} className="text-amber-500" />
                      <span>Instant Simulation (No-Gateway Test Pass)</span>
                    </button>
                  </div>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                    <span className="flex items-center gap-1 font-medium">
                      <ShieldCheck size={13} className="text-emerald-600" /> Razorpay Secured
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Check size={13} className="text-orange-600" /> Instant Pass Dispatched
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Bar for Mobile Users */}
      {!confirmedTicket && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071738]/95 backdrop-blur-lg border-t border-orange-500/40 p-3 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-300 font-bold uppercase block leading-none">
              Workshop Seat
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-amber-300">₹99</span>
              <span className="text-[10px] text-slate-400 line-through">₹499</span>
            </div>
          </div>

          <button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Book Seat Now</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040E24] py-8 text-center text-xs text-slate-400">
        <p className="font-bold text-slate-200">
          WeGrow Skill Campus &amp; B School &bull; AI Lab Innovation Hub
        </p>
        <p className="mt-1">
          Helpline: <strong className="text-orange-400">{workshopDetails.helpline}</strong> &bull; Sivakasi &amp; Virudhunagar, Tamil Nadu
        </p>
      </footer>
    </div>
  );
};
