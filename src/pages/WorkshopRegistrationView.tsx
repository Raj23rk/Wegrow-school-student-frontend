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
  ExternalLink,
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
      { icon: Globe, text: 'Build a real website with AI', color: '#2F6FD6' },
      { icon: Code, text: 'No coding needed', color: '#E5530A' },
      { icon: Laptop, text: 'Live, hands-on learning', color: '#10B981' },
      { icon: Rocket, text: 'Publish your own website live', color: '#8B3FD9' },
      { icon: Award, text: 'Official Certificate of Participation', color: '#F26A1B' },
      { icon: Zap, text: 'Free AI Website Templates & Prompts', color: '#FFC21A' },
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
      // 1. Create Order via Backend
      const orderRes = await api.createWorkshopOrder({
        studentName: studentName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        schoolName: schoolName.trim(),
        grade: grade.trim(),
        city: city.trim() || 'Tamil Nadu',
        notes: notes.trim(),
      });

      if (!orderRes || !orderRes.success) {
        throw new Error(orderRes?.message || 'Failed to initiate workshop order.');
      }

      const orderData = orderRes.data;

      // 2. If Simulation or Razorpay SDK not loaded on window
      if (isSimulation || typeof window.Razorpay === 'undefined') {
        // Direct simulation verification
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
        amount: orderData.amount || 9900,
        currency: orderData.currency || 'INR',
        name: 'WeGrow Skill Campus & B School',
        description: 'WebSpark AI - AI Website Building Workshop (Seat Fee: ₹99)',
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
    <div className="min-h-screen bg-gradient-to-b from-[#071638] via-[#0B1F4D] to-[#05102A] text-slate-100 font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0B1F4D]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition"
          >
            <ArrowLeft size={14} /> Back to Portal
          </button>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-wider text-orange-400 uppercase hidden md:inline">
              WeGrow Skill Campus &amp; B School
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${workshopDetails.helpline}`}
            className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 px-3 py-1.5 rounded-lg border border-yellow-400/30 transition"
          >
            <Phone size={13} /> Helpline: {workshopDetails.helpline}
          </a>
          {onNavigateLogin && (
            <button
              onClick={onNavigateLogin}
              className="text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-3.5 py-1.5 rounded-lg shadow-sm transition"
            >
              Student Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* If payment is confirmed, show Ticket / Pass View */}
        {confirmedTicket ? (
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0B1F4D] to-[#122A63] border-2 border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Background Accent Rings */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Success Header */}
            <div className="text-center relative z-10 mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle size={44} className="text-emerald-400" />
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-widest uppercase rounded-full border border-emerald-500/40 mb-2">
                Registration &bull; 100% Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                You&apos;re Officially Registered!
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Payment of <strong className="text-emerald-300">₹99</strong> received via Razorpay. Your seat is confirmed!
              </p>
            </div>

            {/* Official Admission Pass Card */}
            <div className="bg-white/5 border border-white/15 rounded-2xl p-6 relative z-10 backdrop-blur-md mb-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                    WeGrow Official Pass
                  </span>
                  <h3 className="text-lg font-black text-white">{workshopDetails.title}</h3>
                  <p className="text-xs text-orange-300">{workshopDetails.subheading}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Registration ID</span>
                  <span className="text-base sm:text-lg font-black text-yellow-400 tracking-wider">
                    {confirmedTicket.registrationId}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Participant Name:</span>
                  <span className="text-white font-bold text-sm">{confirmedTicket.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Grade / Class:</span>
                  <span className="text-white font-bold text-sm">{confirmedTicket.grade || grade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">School / College:</span>
                  <span className="text-white font-bold">{confirmedTicket.schoolName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">WhatsApp / Mobile:</span>
                  <span className="text-white font-bold">{confirmedTicket.phone}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Workshop Date:</span>
                    <span className="text-orange-400 font-extrabold text-sm">{workshopDetails.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Time (IST):</span>
                    <span className="text-yellow-400 font-extrabold text-sm">{workshopDetails.time}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Paid ₹99 &bull; Razorpay Verified
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Ref: {confirmedTicket.razorpayPaymentId || 'pay_online_confirmed'}
                </span>
              </div>
            </div>

            {/* Quick Next Steps Banner */}
            <div className="bg-orange-500/15 border border-orange-500/30 rounded-xl p-4 mb-6 relative z-10 text-xs text-orange-200 leading-relaxed">
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
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-white/20 transition"
              >
                <Download size={16} /> Print / Save Pass
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setConfirmedTicket(null)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Register another student
              </button>
            </div>
          </div>
        ) : (
          /* Main Workshop & Registration Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Workshop Details & Visual Poster */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-full text-orange-300 text-xs font-black tracking-wide uppercase">
                <Sparkles size={14} className="text-yellow-400" />
                Special AI Skill Bootcamp for Students
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  WebSpark <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">AI</span>
                </h1>
                <p className="text-lg sm:text-xl font-bold text-amber-300 mt-1">
                  AI Website Building Workshop
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
                  <span>⚡ Build Your Own Website with AI!</span>
                </p>
              </div>

              {/* Official Workshop Visual Poster Card */}
              <div className="relative group rounded-3xl overflow-hidden border-2 border-orange-500/40 shadow-2xl bg-[#091C44]">
                <img
                  src="/webspark-ai-workshop.jpg"
                  alt="WebSpark AI - AI Website Building Workshop Poster"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                  onError={(e) => {
                    // Fallback visual banner if image loads late
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Floating Price Pill */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-4 py-2 rounded-2xl shadow-xl border border-white/20 text-center animate-pulse">
                  <span className="text-[10px] uppercase tracking-wider block opacity-90">Workshop Fee</span>
                  <span className="text-xl sm:text-2xl font-black">₹99</span>
                </div>
              </div>

              {/* Schedule Highlights Grid */}
              <div className="grid grid-cols-3 gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Date</span>
                    <span className="text-xs sm:text-sm font-black text-white">{workshopDetails.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Time</span>
                    <span className="text-xs sm:text-sm font-black text-white">5:00 - 7:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Laptop size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Mode</span>
                    <span className="text-xs sm:text-sm font-black text-white">Online Live</span>
                  </div>
                </div>
              </div>

              {/* What You Will Learn List */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-400" />
                  What You Will Learn in 2 Hours:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {workshopDetails.features.map((feat, idx) => {
                    const IconComp = feat.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
                        <IconComp size={15} style={{ color: feat.color }} className="shrink-0" />
                        <span className="text-slate-200 font-semibold">{feat.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: High-Converting Registration Form & Payment */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-[#0B1F4D] to-[#0A1A3F] border-2 border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                {/* Header inside form */}
                <div className="border-b border-white/10 pb-5 mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black tracking-widest text-orange-400 uppercase">
                      Official Registration Form
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      Limited Live Seats
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Register for WebSpark AI
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill the student details below to book your seat &amp; proceed to the ₹99 Razorpay checkout.
                  </p>
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div className="mb-5 bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
                    <AlertCircle size={16} className="text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleProceedPayment(false);
                  }}
                  className="space-y-4"
                >
                  {/* Student Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Student Full Name <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Sujay Sarvesh / Priyadharshini"
                        className="w-full bg-white/5 border border-white/15 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number & Email in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        WhatsApp / Mobile No. <span className="text-orange-400">*</span>
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
                          className="w-full bg-white/5 border border-white/15 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Meeting link will be sent here</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Email Address <span className="text-orange-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full bg-white/5 border border-white/15 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">For digital pass &amp; certificate</span>
                    </div>
                  </div>

                  {/* School / College Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      School / College Name <span className="text-orange-400">*</span>
                    </label>
                    <div className="relative">
                      <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Wisdom Wealth International School"
                        className="w-full bg-white/5 border border-white/15 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                      />
                    </div>
                  </div>

                  {/* Grade / Class & City in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Class / Standard <span className="text-orange-400">*</span>
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-[#08173B] border border-white/15 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-3 py-2.5 text-sm text-white transition outline-none"
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
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        City / Location
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Sivakasi / Virudhunagar"
                          className="w-full bg-white/5 border border-white/15 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary Box */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 my-5">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                      <span>Workshop Fee (All-Inclusive Pass):</span>
                      <span className="line-through text-slate-400 font-medium">₹499</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                      <span>Student Special Early-Bird Discount:</span>
                      <span className="text-emerald-400 font-bold">- ₹400</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-white uppercase block">Total Payable Now:</span>
                        <span className="text-[10px] text-slate-400">Includes 2-hr live training &amp; certificate</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-yellow-400">₹99</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA: Razorpay Checkout */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3.5 px-6 rounded-2xl text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

                  {/* Demo / Fast Test Checkout Button */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleProceedPayment(true)}
                      className="text-[11px] text-slate-400 hover:text-amber-300 transition flex items-center justify-center gap-1 mx-auto"
                    >
                      <Zap size={12} className="text-yellow-400" />
                      <span>Instant Test Mode Verification (Demo Checkout)</span>
                    </button>
                  </div>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-4 pt-3 text-[11px] text-slate-400 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-400" /> Razorpay 256-bit Encrypted
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Check size={13} className="text-yellow-400" /> Instant Pass Dispatched
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#05102A] py-8 text-center text-xs text-slate-400">
        <p className="font-bold text-slate-300">
          WeGrow Skill Campus &amp; B School &bull; AI Lab Innovation Hub
        </p>
        <p className="mt-1">
          Helpline: <strong className="text-orange-400">{workshopDetails.helpline}</strong> &bull; Sivakasi &amp; Virudhunagar, Tamil Nadu
        </p>
      </footer>
    </div>
  );
};
