import { useState, useEffect, useRef } from "react";

interface CourseDetailsProps {
  onOpenLogin?: () => void;
}

export default function CourseDetails({ onOpenLogin }: CourseDetailsProps) {
  const [statMonths, setStatMonths] = useState(0);
  const [statProjects, setStatProjects] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate 1 Year
          let m = 0;
          const timerM = setInterval(() => {
            m += 1;
            setStatMonths(m);
            if (m >= 1) clearInterval(timerM);
          }, 150);

          // Animate 10+ Projects
          let p = 0;
          const timerP = setInterval(() => {
            p += 1;
            setStatProjects(p);
            if (p >= 10) clearInterval(timerP);
          }, 90);
        }
      },
      { threshold: 0.25 }
    );

    const currentRef = statsRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasAnimated]);

  return (
    <section
      id="course-details"
      aria-label="Why choose WeGrow and course details"
      className="relative bg-cream py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-orange-100/50"
    >
      {/* Background Blobs, Corner Leaves & Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-88 h-88 sm:w-[500px] sm:h-[500px] rounded-full bg-peach/70 blur-3xl" />
        <div className="absolute bottom-10 -left-36 w-88 h-88 sm:w-[480px] sm:h-[480px] rounded-full bg-peach/65 blur-3xl" />
        <div className="absolute top-[35%] -left-32 w-80 h-80 rounded-full bg-sky/50 blur-3xl" />
        <div className="absolute top-[60%] -right-32 w-80 h-80 rounded-full bg-sky/50 blur-3xl" />

        {/* Scattered twinkle stars */}
        <div className="absolute top-16 left-1/3 animate-twinkle select-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFC21A">
            <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
          </svg>
        </div>
        <div className="absolute top-44 right-1/4 animate-twinkle-delay-1 select-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#F26A1B">
            <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Main Grid: Left Block (7) & Right Block (5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ======================================================== */}
          {/* LEFT BLOCK (Col Span: 7): Heading + Features + Collage  */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* 1. Eyebrow */}
            <div className="mb-2 text-center lg:text-left">
              <span className="text-orange uppercase font-extrabold tracking-widest text-xs sm:text-sm">
                WHY CHOOSE WEGROW?
              </span>
            </div>

            {/* 2. Heading with Burst Lines */}
            <div className="relative mb-4 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                <span className="text-navy">A Safe, Fun &amp; </span>
                <span className="text-orange relative inline-block">
                  Future-Ready Learning Environment
                  <span className="hidden sm:inline-block absolute -top-4 -right-8 pointer-events-none select-none" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <line x1="8" y1="24" x2="24" y2="8" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="16" y1="28" x2="28" y2="16" stroke="#F26A1B" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="28" cy="8" r="2" fill="#FFC21A" />
                    </svg>
                  </span>
                </span>
              </h2>
            </div>

            {/* 3. Paragraph */}
            <p className="text-navy-light text-base sm:text-lg leading-relaxed max-w-2xl mb-8 text-center lg:text-left">
              We combine expert guidance, hands-on learning and a supportive environment to help every child explore their potential in the world of AI and technology.
            </p>

            {/* 4. Inner Grid: (a) Feature List & (b) Center Kids Collage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center mt-2">
              
              {/* (a) FEATURE LIST (4 Items) */}
              <div className="flex flex-col space-y-5 sm:space-y-6">
                
                {/* Feature 1 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#EAF3FF] flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105 border border-blue-100">
                    <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                      <path d="M22 6 C31 6, 36 9, 36 16 C36 29, 28 36, 22 40 C16 36, 8 29, 8 16 C8 9, 13 6, 22 6 Z" fill="#2F6FD6" stroke="#0B1F4D" strokeWidth="2" />
                      <path d="M22 9 C28 9, 32 11, 33 16 C33 27, 27 33, 22 36 Z" fill="#FFFFFF" opacity="0.25" />
                      <circle cx="22" cy="22" r="8" fill="#FFFFFF" />
                      <path d="M18 22 L21 25 L26 19" stroke="#2F6FD6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-navy leading-snug group-hover:text-orange transition-colors">
                      Child-Friendly Environment
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-light leading-relaxed mt-1">
                      A safe, supportive and engaging space for young learners.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FFEEE3] flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105 border border-orange-100">
                    <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="14" r="6" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
                      <path d="M12 34 C12 26 16.5 22 22 22 C27.5 22 32 26 32 34" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
                      <circle cx="10" cy="16" r="4" fill="#FFE3C7" stroke="#0B1F4D" strokeWidth="1.6" />
                      <path d="M4 34 C4 28 7 25 11 25" stroke="#0B1F4D" strokeWidth="1.8" />
                      <circle cx="34" cy="16" r="4" fill="#FFE3C7" stroke="#0B1F4D" strokeWidth="1.6" />
                      <path d="M40 34 C40 28 37 25 33 25" stroke="#0B1F4D" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-navy leading-snug group-hover:text-orange transition-colors">
                      Expert &amp; Friendly Trainers
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-light leading-relaxed mt-1">
                      Learn from experienced trainers who make learning fun.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#E7F7EE] flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105 border border-green-100">
                    <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                      <rect x="8" y="24" width="6" height="12" rx="2" fill="#2E9E5B" stroke="#0B1F4D" strokeWidth="1.8" />
                      <rect x="18" y="16" width="6" height="20" rx="2" fill="#2E9E5B" stroke="#0B1F4D" strokeWidth="1.8" />
                      <rect x="28" y="10" width="6" height="26" rx="2" fill="#2E9E5B" stroke="#0B1F4D" strokeWidth="1.8" />
                      <path d="M11 20 L21 12 L31 6" stroke="#F26A1B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <polygon points="31,6 27,6 31,10" fill="#F26A1B" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-navy leading-snug group-hover:text-orange transition-colors">
                      Practical Projects &amp; Certification
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-light leading-relaxed mt-1">
                      Work on real projects and earn a completion certificate.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#F3EAFE] flex items-center justify-center shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105 border border-purple-100">
                    <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r="16" fill="#8B3FD9" opacity="0.15" />
                      <circle cx="22" cy="22" r="14" stroke="#8B3FD9" strokeWidth="2" />
                      <circle cx="22" cy="22" r="9" stroke="#F26A1B" strokeWidth="2" fill="#FFFFFF" />
                      <circle cx="22" cy="22" r="3.5" fill="#0B1F4D" />
                      <path d="M30 14 L37 7" stroke="#0B1F4D" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M33 7 L37 7 L37 11" stroke="#0B1F4D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-navy leading-snug group-hover:text-orange transition-colors">
                      Builds Real Life Skills
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-light leading-relaxed mt-1">
                      Develop confidence, creativity and problem-solving skills.
                    </p>
                  </div>
                </div>

              </div>

              {/* (b) CENTER KIDS COLLAGE */}
              <div className="relative min-h-[460px] flex items-center justify-center">
                
                {/* Frame 1: Left Indian Boy with Laptop */}
                <div className="absolute left-0 top-6 w-52 sm:w-60 h-64 sm:h-72 rounded-[40px] bg-[#FFE3C7] border-4 border-white shadow-xl overflow-hidden animate-frame-1 z-10 flex flex-col items-center justify-end p-4">
                  <svg viewBox="0 0 160 160" className="w-36 h-36">
                    <circle cx="80" cy="55" r="28" fill="#B9794E" />
                    <path d="M52 50 C52 24 108 24 108 50 C108 36 94 30 80 30 C66 30 52 36 52 50 Z" fill="#1C1826" />
                    <circle cx="70" cy="54" r="3" fill="#0B1F4D" />
                    <circle cx="90" cy="54" r="3" fill="#0B1F4D" />
                    <path d="M72 66 Q80 74 88 66" stroke="#0B1F4D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M45 105 C45 84 115 84 115 105 V140 H45 Z" fill="#0B1F4D" />
                    <rect x="55" y="115" width="50" height="30" rx="3" fill="#C5D0E0" stroke="#0B1F4D" strokeWidth="2" />
                    <text x="70" y="134" fill="#0B1F4D" fontSize="12" fontWeight="bold">&lt;/&gt;</text>
                  </svg>
                </div>

                {/* Frame 2: Top-Right Girl with Tablet & Robot */}
                <div className="absolute right-0 top-0 w-44 sm:w-48 h-52 sm:h-56 rounded-[36px] bg-[#CFE6F7] border-4 border-white shadow-xl overflow-hidden animate-frame-2 z-20 flex flex-col items-center justify-end p-3">
                  <svg viewBox="0 0 140 140" className="w-32 h-32">
                    <path d="M45 40 C45 18 95 18 95 40 V80 H45 Z" fill="#1C1826" />
                    <circle cx="70" cy="52" r="24" fill="#C58558" />
                    <circle cx="62" cy="50" r="2.5" fill="#0B1F4D" />
                    <circle cx="78" cy="50" r="2.5" fill="#0B1F4D" />
                    <path d="M64 62 Q70 68 76 62" stroke="#0B1F4D" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M42 95 C42 80 98 80 98 95 V125 H42 Z" fill="#F26A1B" />
                    <rect x="100" y="70" width="24" height="24" rx="5" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
                    <circle cx="107" cy="80" r="2" fill="#00D2D3" />
                    <circle cx="117" cy="80" r="2" fill="#00D2D3" />
                  </svg>
                </div>

                {/* Frame 3: Bottom-Right Boy with Robot Car */}
                <div className="absolute right-4 bottom-2 w-48 sm:w-52 h-52 sm:h-56 rounded-[36px] bg-[#F1EFFC] border-4 border-white shadow-xl overflow-hidden animate-frame-3 z-30 flex flex-col items-center justify-end p-3">
                  <svg viewBox="0 0 140 140" className="w-32 h-32">
                    <circle cx="70" cy="46" r="22" fill="#BA784C" />
                    <path d="M48 42 C48 24 92 24 92 42 Z" fill="#1C1826" />
                    <circle cx="63" cy="46" r="2.5" fill="#0B1F4D" />
                    <circle cx="77" cy="46" r="2.5" fill="#0B1F4D" />
                    <path d="M65 56 Q70 61 75 56" stroke="#0B1F4D" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M44 85 C44 72 96 72 96 85 V110 H44 Z" fill="#2E9E5B" />
                    <rect x="50" y="100" width="40" height="22" rx="4" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
                    <circle cx="60" cy="122" r="5" fill="#0B1F4D" />
                    <circle cx="80" cy="122" r="5" fill="#0B1F4D" />
                  </svg>
                </div>

                {/* Lightbulb Decoration */}
                <div className="absolute top-36 left-48 z-40 animate-twinkle">
                  <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="16" r="12" fill="#FFC21A" stroke="#0B1F4D" strokeWidth="2" />
                    <path d="M15 26 H25 V30 H15 Z" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
                  </svg>
                </div>

                {/* Sticky Note */}
                <div className="absolute -left-4 bottom-4 z-40 bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-orange-100 transform -rotate-12">
                  <div className="font-caveat text-lg sm:text-xl font-bold text-navy leading-none">
                    Learn / Create / Innovate
                  </div>
                  <div className="w-full h-1 bg-orange rounded-full mt-1.5" />
                </div>

              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT BLOCK – COURSE DETAILS CARD (Col Span: 5)          */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#FFF8EF] to-[#FFF1E4] rounded-[32px] p-6 sm:p-8 shadow-xl border border-white">
            
            {/* Header Row */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-light flex items-center justify-center text-orange flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <span className="text-orange uppercase font-extrabold tracking-widest text-xs">
                  COURSE DETAILS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-navy leading-tight">
                  Everything You <span className="text-orange">Need to Know</span>
                </h3>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3">
              
              {/* Row 1 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-orange-100/50">
                <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-light uppercase">Course Duration</div>
                  <div className="text-sm sm:text-base font-extrabold text-navy">1 Year <span className="text-xs text-navy-light font-semibold">(Starts Oct 20, 2026)</span></div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-peach/30 border border-orange-100/50">
                <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-light uppercase">Who Can Join?</div>
                  <div className="text-sm sm:text-base font-extrabold text-navy">School Students <span className="text-xs text-navy-light font-semibold">(Grades 4 – 12)</span></div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-orange-100/50">
                <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-light uppercase">Venue</div>
                  <div className="text-sm sm:text-base font-extrabold text-navy">WeGrow Skill Campus &amp; B School, Sivakasi</div>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-peach/30 border border-orange-100/50">
                <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-light uppercase">Learning Mode</div>
                  <div className="text-sm sm:text-base font-extrabold text-navy">Hands-on, Project Based</div>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/70 border border-orange-100/50">
                <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-light uppercase">Certificate</div>
                  <div className="text-sm sm:text-base font-extrabold text-navy">Course Completion Certificate</div>
                </div>
              </div>

            </div>

            {/* Limited Period Offer Box with Silver Coin Animation */}
            <div className="mt-6 rounded-3xl bg-[#FFEFE2] p-5 sm:p-6 relative border border-orange-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDCC4] text-orange font-extrabold text-xs uppercase tracking-wider mb-3">
                <span>🎁</span> Limited Period Offer
              </span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-navy leading-snug">
                    <span className="text-orange">Enroll Now</span> &amp; Get a{" "}
                    <span className="text-orange">Silver Coin</span> as a Special Gift!
                  </h4>
                  <button
                    onClick={() => {
                      if (onOpenLogin) {
                        onOpenLogin();
                      } else {
                        window.location.hash = "login";
                      }
                    }}
                    className="inline-flex items-center gap-2 mt-3.5 bg-gradient-to-r from-[#F7781F] to-[#E5530A] text-white font-extrabold text-sm rounded-xl px-5 py-2.5 shadow-cta hover:shadow-cta-hover transition-all cursor-pointer border-0"
                  >
                    <span>Student Login</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Animated Silver Coin SVG */}
                <div className="relative flex-shrink-0 animate-coin-shimmer">
                  <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" fill="#D6DFE8" stroke="#0B1F4D" strokeWidth="2.5" />
                    <circle cx="40" cy="40" r="30" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="40" cy="40" r="22" fill="#EAF0F6" stroke="#9BB0C1" strokeWidth="1.5" />
                    {/* Embossed Lotus motif */}
                    <path d="M40 28 C35 34 32 40 40 48 C48 40 45 34 40 28 Z" fill="#9BB0C1" opacity="0.6" />
                    <path d="M30 42 C36 40 40 44 40 48 C36 48 30 46 30 42 Z" fill="#9BB0C1" opacity="0.5" />
                    <path d="M50 42 C44 40 40 44 40 48 C44 48 50 46 50 42 Z" fill="#9BB0C1" opacity="0.5" />
                    {/* Red Ribbon Bow */}
                    <circle cx="40" cy="10" r="4" fill="#E5530A" />
                    <path d="M36 10 C32 6 28 8 32 14 Z" fill="#F26A1B" />
                    <path d="M44 10 C48 6 52 8 48 14 Z" fill="#F26A1B" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM STATS BAR (With Count-Up Numbers)                 */}
        {/* ======================================================== */}
        <div
          ref={statsRef}
          className="mt-12 sm:mt-16 rounded-3xl bg-[#EEF5FF] py-6 px-6 sm:px-8 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-center relative"
        >
          {/* Stat 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue shadow-xs flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-navy">{statMonths >= 1 ? "1 Year" : "1 Year"}</div>
              <div className="text-xs text-navy-light font-semibold">Structured Learning</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3.5 md:border-l md:border-navy/10 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue shadow-xs flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-navy">{statProjects}+ Projects</div>
              <div className="text-xs text-navy-light font-semibold">Hands-on Experience</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3.5 md:border-l md:border-navy/10 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange shadow-xs flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-navy">Certificate</div>
              <div className="text-xs text-navy-light font-semibold">Upon Completion</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3.5 md:border-l md:border-navy/10 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue shadow-xs flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-navy leading-tight">Future-Ready</div>
              <div className="text-xs text-navy-light font-semibold">Skills for Tomorrow</div>
            </div>
          </div>

          {/* Floating cartoon rocket */}
          <div className="hidden sm:block absolute -bottom-5 -right-3 animate-rocket pointer-events-none select-none">
            <svg width="44" height="44" viewBox="0 0 50 50" fill="none">
              <path d="M25 4 C16 14 14 28 16 42 H34 C36 28 34 14 25 4 Z" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
              <circle cx="25" cy="24" r="5" fill="#CFE6F7" stroke="#0B1F4D" strokeWidth="1.5" />
              <path d="M16 32 L8 40 H16 Z" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="1.5" />
              <path d="M34 32 L42 40 H34 Z" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
