import React from "react";

interface HeroProps {
  onOpenLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLogin }) => {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 sm:py-12 lg:py-16 flex items-center overflow-x-hidden bg-cream">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-[1440px] mx-auto">
        {/* LEFT COLUMN (Col Span: 7) */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start z-10 w-full">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-light border border-orange-200/70 shadow-sm mb-4">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-navy flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="text-orange font-extrabold uppercase tracking-wide text-xs sm:text-sm">
              1-YEAR AI &amp; TECHNOLOGY PROGRAM • SIVAKASI CAMPUS
            </span>
          </div>

          {/* Headline */}
          <div className="relative mb-5 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[56px] font-black leading-[1.14] tracking-tight">
              <span className="block text-navy">Turn Screen Time</span>
              <span className="block text-orange relative inline-block mt-1">
                Into Smart Learning
                <span className="absolute -top-3 -right-6 select-none pointer-events-none" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFC21A">
                    <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
                  </svg>
                </span>
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-navy-light font-semibold mb-8 max-w-xl leading-relaxed">
            Hands-on learning, creative robotics, and future-ready tech skills for school students at <strong className="text-navy">WeGrow Skill Campus &amp; B School, Sivakasi</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F7781F] via-[#F26A1B] to-[#E5530A] text-white font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg shadow-orange-300/40 hover:shadow-orange-400/60 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              <span>Student Sign In Portal</span>
              <span aria-hidden="true">→</span>
            </button>

            <a
              href="#course-details"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-navy font-black text-base sm:text-lg px-8 py-4 rounded-2xl border-2 border-orange-200/80 hover:bg-orange-light/30 transition-all duration-300"
            >
              <span>Explore Course Details</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-orange-200/60 w-full max-w-lg">
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-black text-orange">1 Year</div>
              <div className="text-xs sm:text-sm font-bold text-navy-light uppercase tracking-wider">Cohort Program</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#2F6FD6]">10+</div>
              <div className="text-xs sm:text-sm font-bold text-navy-light uppercase tracking-wider">Live Projects</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#2E9E5B]">100%</div>
              <div className="text-xs sm:text-sm font-bold text-navy-light uppercase tracking-wider">Practical Lab</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Mascot / Creative Graphic (Col Span: 5) */}
        <div className="lg:col-span-5 flex justify-center items-center relative z-10 w-full mt-6 lg:mt-0">
          <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
            {/* Background ambient decorative cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange/15 to-blue/15 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative w-full h-full rounded-3xl bg-white/70 backdrop-blur-md border border-orange-200/80 p-4 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
              <img
                src="/mascot-optimized.jpg"
                alt="WeGrow Sivakasi AI & Robotics Mascot"
                width={558}
                height={558}
                loading="eager"
                className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/mascot.png";
                }}
              />

              {/* Floating Badge on Image */}
              <div className="absolute top-7 left-7 bg-[#0B1F4D]/90 backdrop-blur-md border border-cyan-400/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span className="text-[11px] font-black text-cyan-200 tracking-wider">
                  WEGROW TECH CAMPUS
                </span>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-orange-200 shadow-lg text-left flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-orange uppercase tracking-wider">Grades 5 - 12</div>
                  <div className="text-sm font-extrabold text-navy">AI, Robotics &amp; Python Challenge</div>
                </div>
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-lg bg-orange text-white font-extrabold text-xs shadow-sm hover:bg-orange-dark transition-colors cursor-pointer"
                >
                  Sign In →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
