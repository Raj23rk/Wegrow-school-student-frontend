import React, { useState, useEffect } from "react";
import { api, setAuthToken } from "../services/api";
import { Student } from "../types";
import { useToast } from "../components/ToastContext";

interface StudentLoginViewProps {
  onLoginSuccess: (student: Student) => void;
  onBackToHome: () => void;
}

export const StudentLoginView: React.FC<StudentLoginViewProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("wegrow_remembered_username");
      if (savedUser && savedUser !== "aarav.sharma@gmail.com") {
        setUsername(savedUser);
        setRememberMe(true);
      } else {
        localStorage.removeItem("wegrow_remembered_username");
        setUsername("");
        setPassword("");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username/email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login({
        email: username.trim(),
        password: password.trim(),
      });

      if (res.token) {
        setAuthToken(res.token);
      }

      if (rememberMe) {
        try {
          localStorage.setItem("wegrow_remembered_username", username.trim());
        } catch {
          // ignore
        }
      } else {
        try {
          localStorage.removeItem("wegrow_remembered_username");
        } catch {
          // ignore
        }
      }

      setLoginSuccess(true);

      setTimeout(() => {
        onLoginSuccess(res.student);
      }, 600);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid credentials. Please verify your student username and password."
      );
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row m-0 p-0 overflow-x-hidden bg-white">
      {/* ======================================================== */}
      {/* LEFT HALF: AI Explore Kids Showcase                      */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 min-h-[440px] lg:min-h-screen bg-gradient-to-br from-[#0B1F4D] via-[#0F2964] to-[#071638] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#2F6FD6_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#00E5FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar on Left Panel */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full transition-all text-xs sm:text-sm font-bold tracking-wide backdrop-blur-md group cursor-pointer text-white"
          >
            <svg
              className="w-4 h-4 text-orange group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to WeGrow Home</span>
          </button>

          <span className="inline-flex items-center gap-2 text-xs font-black px-3.5 py-1.5 rounded-full bg-orange/20 border border-orange/40 text-orange-200">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            AI EXPLORE PORTAL
          </span>
        </div>

        {/* Center Illustration */}
        <div className="relative z-10 my-auto py-6 flex flex-col items-center max-w-lg mx-auto w-full">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group">
            <img
              src="/ai-kids-explore.jpg"
              alt="Kids Exploring AI and Robotics"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/image.png";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/95 via-transparent to-black/30" />

            <div className="absolute top-4 left-4 bg-[#0B1F4D]/85 backdrop-blur-md border border-cyan-400/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <span className="text-[11px] font-black text-cyan-200 tracking-wider">
                AI BOT &bull; SPARK ACTIVE
              </span>
            </div>

            <div className="absolute top-4 right-4 bg-orange/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[11px] font-black text-white shadow-lg">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Sivakasi Campus</span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-left">
              <div className="text-xs font-black uppercase tracking-widest text-[#FFC21A] flex items-center gap-2 mb-1.5">
                <span>Interactive Learning</span>
                <span>&bull;</span>
                <span>Grades 5 - 12</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                Turning Creative Ideas Into Real AI Inventions
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mt-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-orange font-black text-lg sm:text-xl">10+</div>
              <div className="text-[11px] text-blue-100 font-bold uppercase tracking-wider">Live Projects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-[#00E5FF] font-black text-lg sm:text-xl">100%</div>
              <div className="text-[11px] text-blue-100 font-bold uppercase tracking-wider">Hands-on Lab</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-[#FFC21A] font-black text-lg sm:text-xl">Certified</div>
              <div className="text-[11px] text-blue-100 font-bold uppercase tracking-wider">Tech Growth</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm text-center">
          <p className="font-caveat text-xl sm:text-2xl text-orange-200 font-bold">
            &ldquo;Every session is designed to spark curiosity, build confidence &amp; create future innovators.&rdquo;
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT HALF: Student Login Panel                          */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 sm:h-12 w-auto flex items-center">
              <img
                src="/wegrow-logo.webp"
                alt="WeGrow Skill Campus & B School"
                width={176}
                height={48}
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo copy.png";
                }}
              />
            </div>
            <div className="hidden xs:flex flex-col pl-2.5 border-l-2 border-orange/40 text-left leading-none">
              <span className="text-[11px] font-black text-navy tracking-wider uppercase">
                &amp; B School
              </span>
              <span className="text-[9px] font-extrabold text-orange tracking-widest uppercase mt-0.5">
                SIVAKASI
              </span>
            </div>
          </div>

          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black bg-orange-light text-orange border border-orange-200">
            Student Portal
          </span>
        </div>

        {/* Center Form Section */}
        <div className="my-auto py-6 max-w-md w-full mx-auto">
          <div className="mb-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-light/60 border border-orange-200/60 text-orange font-black text-xs uppercase tracking-wider mb-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span>Student Sign In</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              Welcome Back, Explorer!
            </h1>
            <p className="text-sm sm:text-base text-navy-light mt-1.5 font-semibold">
              Sign in with your student credentials to access AI lessons, coding challenges, and project badges.
            </p>
          </div>



          {/* Success Notification */}
          {loginSuccess && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
                ✓
              </div>
              <div>
                <h4 className="font-extrabold text-sm">Login Successful!</h4>
                <p className="text-xs text-emerald-700">
                  Welcome back! Opening your Dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-navy uppercase tracking-wider mb-1.5">
                Username / Roll No / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. WG26-001 or admin@wegrow.edu"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FFF8EF] border border-orange-200/90 rounded-2xl text-navy font-semibold text-sm placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all"
                  required
                />

              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-navy uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Please contact your WeGrow Sivakasi Mentor to reset your credentials.", "Password Reset")}
                  className="text-xs font-extrabold text-orange hover:text-orange-dark transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 bg-[#FFF8EF] border border-orange-200/90 rounded-2xl text-navy font-semibold text-sm placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy/40 hover:text-orange transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-orange focus:ring-orange border-orange-300 accent-orange"
                />
                <span className="text-xs font-bold text-navy-light">
                  Remember this device
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 ${
                username.toLowerCase().includes('admin')
                  ? 'bg-gradient-to-r from-navy via-[#0f2d72] to-[#0a1e4a] shadow-blue-900/30 hover:shadow-blue-900/50'
                  : 'bg-gradient-to-r from-[#F7781F] via-[#F26A1B] to-[#E5530A] shadow-orange-300/40 hover:shadow-orange-400/60'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : username.toLowerCase().includes('admin') ? (
                <>
                  <span>Sign In to Admin Control Center</span>
                  <span className="text-amber-300">👑</span>
                </>
              ) : (
                <>
                  <span>Sign In as Student</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Bar: Links & Support */}
        <div className="pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={onBackToHome}
            className="text-navy-light font-semibold hover:text-orange"
          >
            ← Return to Landing Page
          </button>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-navy font-bold hover:text-green transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#2E9E5B]" />
            <span>Need Help? WhatsApp Mentor</span>
          </a>
        </div>
      </div>
    </div>
  );
};
