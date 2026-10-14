export default function Footer() {
  return (
    <footer id="footer" className="relative bg-[#071638] text-white pt-16 pb-10 overflow-hidden border-t-4 border-orange">
      {/* Background Ambient Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-orange/15 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-blue/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-peach/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* MAIN FOOTER GRID (4 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* COLUMN 1: BRAND, ABOUT & SOCIAL (Col Span: 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            
            {/* Official Logo Card */}
            <a
              href="#"
              className="inline-flex items-center bg-white px-4 py-2.5 rounded-2xl shadow-md border border-white/30 mb-5 group hover:scale-105 transition-transform"
              aria-label="WeGrow Sivakasi Home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wegrow-logo.webp"
                alt="WeGrow Skill Campus & B School"
                width={176}
                height={44}
                className="h-10 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo copy.png";
                }}
              />
              <div className="flex flex-col text-left pl-3 border-l-2 border-orange/40 ml-3">
                <span className="text-[11px] font-black text-navy uppercase leading-none">
                  &amp; B School
                </span>
                <span className="text-[9px] font-extrabold text-orange uppercase tracking-widest mt-1">
                  SIVAKASI
                </span>
              </div>
            </a>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-sm">
              WeGrow Skill Campus &amp; B School, Sivakasi is dedicated to transforming school students into future-ready innovators through practical AI, robotics, coding, and real-world technology education.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center gap-2 mb-6 text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <span className="text-orange">★</span> Govt. Recognized
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <span className="text-green">✓</span> Certified Trainers
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-orange hover:text-white text-slate-300 flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-blue hover:text-white text-slate-300 flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-600 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-200"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#071638" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-sky hover:text-navy text-slate-300 flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>

          </div>

          {/* COLUMN 2: QUICK LINKS (Col Span: 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300 font-semibold">
              <li><a href="#home" className="hover:text-orange transition-colors">Home</a></li>
              <li><a href="#what-kids-learn" className="hover:text-orange transition-colors">What Kids Learn</a></li>
              <li><a href="#why-choose" className="hover:text-orange transition-colors">Why Choose WeGrow</a></li>
              <li><a href="#course-details" className="hover:text-orange transition-colors">Course Details</a></li>
              <li><a href="#faqs" className="hover:text-orange transition-colors">FAQs</a></li>
              <li><a href="#login" className="hover:text-orange transition-colors text-orange font-bold">Student Login</a></li>
            </ul>
          </div>

          {/* COLUMN 3: PROGRAM MODULES (Col Span: 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow" />
              Program Highlights
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300 font-semibold">
              <li className="flex items-center gap-2">
                <span className="text-orange">▸</span> 1-Year Structured Learning
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange">▸</span> AI &amp; Robotics Hands-on Lab
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange">▸</span> Python Coding &amp; Logic
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange">▸</span> 10+ Practical Live Projects
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange">▸</span> Course Completion Certificate
              </li>
              <li className="flex items-center gap-2 text-yellow font-bold">
                <span>🪙</span> Silver Coin Special Gift
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CAMPUS VENUE & CONTACT (Col Span: 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green" />
              Campus &amp; Venue
            </h4>
            
            <div className="space-y-3.5 text-sm text-slate-300">
              {/* Venue Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="leading-relaxed">
                  <span className="font-extrabold text-white">WeGrow Skill Campus &amp; B School</span><br />
                  Sivakasi, Tamil Nadu, India.
                </div>
              </div>

              {/* Helpline */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-green flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <a href="tel:+919876543210" className="hover:text-white font-bold transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-sky flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <a href="mailto:admissions@wegrow.edu.in" className="hover:text-white font-bold transition-colors">
                    admissions@wegrow.edu.in
                  </a>
                </div>
              </div>

              {/* Visiting Hours */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-yellow flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="text-xs">
                  Mon – Sat: 9:00 AM – 6:30 PM
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center md:text-left">
            © 2026 <strong className="text-slate-300">WeGrow Skill Campus &amp; B School, Sivakasi</strong>. All Rights Reserved.
          </div>
          
          <div className="flex items-center gap-6 font-semibold">
            <a href="#" className="hover:text-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange transition-colors">Terms of Admission</a>
            <a href="#" className="hover:text-orange transition-colors">Child Safety Policy</a>
          </div>
        </div>

      </div>

    </footer>
  );
}
