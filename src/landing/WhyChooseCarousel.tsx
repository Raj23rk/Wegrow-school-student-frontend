import { useState, useEffect, useRef, useCallback } from "react";

export default function WhyChooseCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalCards = 8;

  // Calculate cards per view on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerView(4);
      } else if (width >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute pages
  const step = cardsPerView === 4 ? 2 : cardsPerView === 2 ? 2 : 1;
  const maxStartIndex = Math.max(0, totalCards - cardsPerView);
  const pageIndices: number[] = [];
  for (let i = 0; i <= maxStartIndex; i += step) {
    pageIndices.push(i);
  }
  if (!pageIndices.includes(maxStartIndex)) {
    pageIndices.push(maxStartIndex);
  }

  const totalPages = pageIndices.length;

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Autoplay timer
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      goToNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [goToNext, isHovered]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Card translation calculation:
  // In flex with gap-6 (24px): each card is 100% / cpv with gap offsets
  const activeStartIndex = pageIndices[currentPage] || 0;
  const cardTranslatePercent = activeStartIndex * (100 / cardsPerView);
  const gapOffset = activeStartIndex * (cardsPerView > 1 ? 24 / cardsPerView : 24);

  return (
    <section
      id="why-choose"
      aria-label="Program highlights"
      className="relative bg-cream py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* ========================================== */}
      {/* BACKGROUND BLOBS, HILL & SPARKLE STARS    */}
      {/* ========================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
        {/* Peach top-left blob */}
        <div className="absolute -top-36 -left-36 w-88 h-88 sm:w-[480px] sm:h-[480px] rounded-full bg-peach/75 blur-3xl"></div>
        {/* Peach top-right blob */}
        <div className="absolute -top-36 -right-36 w-88 h-88 sm:w-[480px] sm:h-[480px] rounded-full bg-peach/75 blur-3xl"></div>
        {/* Sky-blue on left edge */}
        <div className="absolute top-[40%] -left-32 w-80 h-80 rounded-full bg-sky/55 blur-3xl"></div>
        {/* Sky-blue on right edge */}
        <div className="absolute top-[40%] -right-32 w-80 h-80 rounded-full bg-sky/55 blur-3xl"></div>

        {/* Wavy peach hill shape along the bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            className="w-full h-16 sm:h-24 md:h-28 text-peach/40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 C240,110 480,20 720,70 C960,120 1200,30 1440,75 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Scattered 4-point sparkle stars with twinkle animation */}
        <div className="absolute top-14 left-10 animate-twinkle select-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFC21A">
            <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
          </svg>
        </div>
        <div className="absolute top-28 right-20 animate-twinkle-delay-1 select-none">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#F26A1B">
            <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
          </svg>
        </div>
        <div className="absolute bottom-28 left-1/4 animate-twinkle-delay-2 select-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC21A">
            <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-1/4 animate-twinkle select-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#F26A1B">
            <path d="M12 0L14.4 8.6L24 12L14.4 15.4L12 24L9.6 15.4L0 12L9.6 8.6L12 0Z" />
          </svg>
        </div>
      </div>

      {/* ========================================== */}
      {/* DESKTOP DECORATIONS (Hidden on Mobile)     */}
      {/* ========================================== */}
      {/* Top-Left: Handwritten text + Underline + Paper plane */}
      <div
        className="hidden lg:block absolute top-10 left-6 xl:left-14 select-none pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="relative transform -rotate-12">
          <div className="font-caveat text-3xl xl:text-4xl text-navy font-bold leading-[1.05] tracking-wide">
            <div>Explore</div>
            <div>Create</div>
            <div>Innovate</div>
          </div>
          <svg className="w-36 h-4 text-orange mt-1" viewBox="0 0 160 16" fill="none" preserveAspectRatio="none">
            <path d="M2 11C35 4 85 3 158 13C105 7 50 8 4 14" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
        {/* Paper plane with dashed curly trail line */}
        <div className="absolute -top-4 left-36">
          <svg width="90" height="70" viewBox="0 0 100 80" fill="none" className="text-navy">
            <path
              d="M10 65 C 30 70, 50 45, 40 28 C 32 14, 58 12, 75 22"
              stroke="#0B1F4D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 5"
              opacity="0.6"
            />
            <g transform="translate(72, 18) rotate(20)">
              <polygon points="0,0 24,9 7,15 5,22" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" strokeLinejoin="round" />
              <line x1="24" y1="9" x2="7" y2="15" stroke="#0B1F4D" strokeWidth="2" />
            </g>
          </svg>
        </div>
      </div>

      {/* Top-Right: Cute Robot + Handwritten text + Rocket & Trail */}
      <div
        className="hidden lg:block absolute top-8 right-6 xl:right-12 select-none pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="relative flex items-center gap-4">
          {/* Cute Floating Robot SVG */}
          <div className="animate-float-slow">
            <svg width="76" height="88" viewBox="0 0 80 92" fill="none">
              <line x1="40" y1="18" x2="40" y2="6" stroke="#0B1F4D" strokeWidth="3" strokeLinecap="round" />
              <circle cx="40" cy="5" r="4.5" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
              <rect x="12" y="28" width="7" height="15" rx="3.5" fill="#2F6FD6" stroke="#0B1F4D" strokeWidth="2" />
              <rect x="61" y="28" width="7" height="15" rx="3.5" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
              <rect x="17" y="16" width="46" height="38" rx="16" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2.5" />
              <rect x="23" y="24" width="34" height="22" rx="10" fill="#0B1F4D" />
              <circle cx="33" cy="32" r="3" fill="#00E5FF" />
              <circle cx="47" cy="32" r="3" fill="#00E5FF" />
              <path d="M35 39 C37 42, 43 42, 45 39" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M26 56 C26 52, 54 52, 54 56 L58 78 C58 84, 22 84, 22 78 Z" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2.5" />
              <rect x="33" y="62" width="14" height="8" rx="3" fill="#FFE9D9" stroke="#F26A1B" strokeWidth="1.5" />
              <path d="M22 62 C15 62, 10 52, 13 46" stroke="#0B1F4D" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="13" cy="45" r="3.5" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
              <path d="M58 62 C65 62, 70 52, 67 46" stroke="#0B1F4D" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="67" cy="45" r="3.5" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
            </svg>
          </div>

          {/* Handwritten text in Caveat */}
          <div className="transform -rotate-12">
            <div className="font-caveat text-2xl xl:text-3xl text-navy font-bold leading-[1.05] tracking-wide">
              <div>Curious</div>
              <div>Minds</div>
              <div>Brighter</div>
              <div>Tomorrows</div>
            </div>
            <svg className="w-32 h-3.5 text-orange mt-0.5" viewBox="0 0 140 14" fill="none" preserveAspectRatio="none">
              <path d="M2 10C30 3 75 3 138 11" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Rocket with flame tilted up-right */}
          <div className="ml-1">
            <svg width="60" height="72" viewBox="0 0 64 78" fill="none" className="transform rotate-12">
              <path
                d="M-15 45 C -5 65, 10 70, 20 60 C 25 50, 20 40, 28 35"
                stroke="#0B1F4D"
                strokeWidth="1.8"
                strokeDasharray="3 4"
                opacity="0.45"
                fill="none"
              />
              <g className="animate-flame">
                <path d="M32 54 C27 62, 26 70, 32 75 C38 70, 37 62, 32 54 Z" fill="#F26A1B" />
                <path d="M32 56 C29 61, 28 65, 32 69 C36 65, 35 61, 32 56 Z" fill="#FFC21A" />
              </g>
              <path d="M32 8 C21 19, 19 36, 21 52 H43 C45 36, 43 19, 32 8 Z" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
              <path d="M32 8 C26 14, 23 22, 23 26 H41 C41 22, 38 14, 32 8 Z" fill="#F26A1B" />
              <circle cx="32" cy="33" r="5" fill="#CFE6F7" stroke="#0B1F4D" strokeWidth="1.8" />
              <path d="M21 42 L12 52 H21 Z" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="1.8" />
              <path d="M43 42 L52 52 H43 Z" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom-Left: Stack of 3 Books on wooden shelf + plant */}
      <div
        className="hidden lg:block absolute bottom-8 left-6 xl:left-14 select-none pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="relative w-48 h-36">
          <div className="absolute -top-4 left-6">
            <svg width="46" height="48" viewBox="0 0 50 52" fill="none">
              <path d="M18 18 C10 6, 16 -2, 26 2 C36 6, 28 18, 18 18 Z" fill="#2E9E5B" />
              <path d="M28 16 C38 4, 46 10, 40 20 C32 26, 26 20, 28 16 Z" fill="#25864C" />
              <path d="M14 20 C2 16, 6 28, 18 24 Z" fill="#38B369" />
              <path d="M12 24 H38 L35 48 H15 L12 24 Z" fill="#D36B3D" />
              <rect x="10" y="22" width="30" height="5" rx="2" fill="#B9552A" />
            </svg>
          </div>
          <div className="absolute bottom-0 -left-4 w-52 h-3.5 bg-[#E8C798] rounded-md shadow-md border border-[#D5A973]"></div>
          <div className="absolute bottom-3 left-2 w-42 h-8 bg-green rounded-md shadow-md flex items-center px-3 border-l-4 border-emerald-950 transform rotate-1">
            <span className="text-[11px] font-black tracking-wider text-white">GROW</span>
            <div className="ml-auto w-3 h-4 bg-white/90 rounded-sm shadow-inner"></div>
          </div>
          <div className="absolute bottom-9 left-4 w-40 h-8 bg-orange rounded-md shadow-md flex items-center px-3 border-l-4 border-orange-950 transform -rotate-2">
            <span className="text-[11px] font-black tracking-wider text-white">CREATE</span>
            <div className="ml-auto w-3 h-4 bg-white/90 rounded-sm shadow-inner"></div>
          </div>
          <div className="absolute bottom-15 left-2 w-38 h-8 bg-blue rounded-md shadow-md flex items-center px-3 border-l-4 border-blue-950 transform rotate-2">
            <span className="text-[11px] font-black tracking-wider text-white">EXPLORE</span>
            <div className="ml-auto w-3 h-4 bg-white/90 rounded-sm shadow-inner"></div>
          </div>
        </div>
      </div>

      {/* Bottom-Right: Terracotta plant pot + pencil cup */}
      <div
        className="hidden lg:block absolute bottom-8 right-6 xl:right-14 select-none pointer-events-none z-10 opacity-90"
        aria-hidden="true"
      >
        <div className="relative w-44 h-36">
          <div className="absolute bottom-0 left-0">
            <svg width="68" height="78" viewBox="0 0 72 82" fill="none">
              <path d="M36 40 C15 15, 8 2, 28 8 C48 14, 42 36, 36 40 Z" fill="#2E9E5B" />
              <path d="M38 38 C55 12, 68 8, 58 24 C48 40, 42 38, 38 38 Z" fill="#25864C" />
              <path d="M36 39 C24 22, 28 6, 38 4 C48 2, 42 28, 36 39 Z" fill="#38B369" />
              <path d="M16 44 H56 L51 80 H21 L16 44 Z" fill="#E07345" />
              <rect x="13" y="40" width="46" height="8" rx="2" fill="#C25A2E" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-3">
            <svg width="56" height="74" viewBox="0 0 60 78" fill="none">
              <line x1="22" y1="12" x2="26" y2="42" stroke="#2F6FD6" strokeWidth="4.5" strokeLinecap="round" />
              <polygon points="22,10 20,15 24,15" fill="#FFE3C7" />
              <line x1="30" y1="6" x2="31" y2="42" stroke="#FFC21A" strokeWidth="4.5" strokeLinecap="round" />
              <polygon points="30,4 28,9 32,9" fill="#FFE3C7" />
              <line x1="38" y1="14" x2="36" y2="42" stroke="#F26A1B" strokeWidth="4.5" strokeLinecap="round" />
              <polygon points="38,12 36,17 40,17" fill="#FFE3C7" />
              <path d="M16 38 H44 L41 74 H19 L16 38 Z" fill="#F26A1B" />
              <rect x="14" y="36" width="32" height="6" rx="2" fill="#E5530A" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MAIN SECTION CONTENT                       */}
      {/* ========================================== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        {/* TOP CONTENT (Centered) */}
        <div className="text-center flex flex-col items-center">
          {/* Mobile-Only Robot Icon */}
          <div className="block lg:hidden mb-2 animate-float-slow select-none" aria-hidden="true">
            <svg width="54" height="62" viewBox="0 0 80 92" fill="none">
              <line x1="40" y1="18" x2="40" y2="6" stroke="#0B1F4D" strokeWidth="3" strokeLinecap="round" />
              <circle cx="40" cy="5" r="4.5" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
              <rect x="12" y="28" width="7" height="15" rx="3.5" fill="#2F6FD6" stroke="#0B1F4D" strokeWidth="2" />
              <rect x="61" y="28" width="7" height="15" rx="3.5" fill="#F26A1B" stroke="#0B1F4D" strokeWidth="2" />
              <rect x="17" y="16" width="46" height="38" rx="16" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2.5" />
              <rect x="23" y="24" width="34" height="22" rx="10" fill="#0B1F4D" />
              <circle cx="33" cy="32" r="3" fill="#00E5FF" />
              <circle cx="47" cy="32" r="3" fill="#00E5FF" />
              <path d="M35 39 C37 42, 43 42, 45 39" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M26 56 C26 52, 54 52, 54 56 L58 78 C58 84, 22 84, 22 78 Z" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2.5" />
            </svg>
          </div>

          {/* 1. Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-orange-light border border-orange-200/80 shadow-xs mb-5 sm:mb-6">
            <svg
              className="w-5 h-5 text-navy flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="text-orange font-extrabold uppercase tracking-wide text-xs sm:text-sm">
              1-YEAR AI &amp; TECHNOLOGY PROGRAM
            </span>
          </div>

          {/* 2. Heading with Burst Lines & Dots */}
          <div className="relative max-w-4xl mx-auto mb-4 sm:mb-5">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              <span className="block text-navy">More Than Screen Time</span>
              <span className="relative inline-flex items-center justify-center text-orange mt-1 sm:mt-2">
                {/* Left Burst Lines + Tiny Yellow Dots */}
                <span
                  className="hidden sm:inline-flex items-center absolute -left-12 sm:-left-16 md:-left-20 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <line x1="38" y1="22" x2="16" y2="10" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="38" y1="22" x2="12" y2="22" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="38" y1="22" x2="16" y2="34" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="8" cy="14" r="2.5" fill="#FFC21A" />
                    <circle cx="8" cy="30" r="2" fill="#FFC21A" />
                  </svg>
                </span>

                <span>A Brighter Future</span>

                {/* Right Burst Lines + Tiny Yellow Dots */}
                <span
                  className="hidden sm:inline-flex items-center absolute -right-12 sm:-right-16 md:-right-20 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <line x1="6" y1="22" x2="28" y2="10" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="6" y1="22" x2="32" y2="22" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="6" y1="22" x2="28" y2="34" stroke="#F26A1B" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx="36" cy="14" r="2.5" fill="#FFC21A" />
                    <circle cx="36" cy="30" r="2" fill="#FFC21A" />
                  </svg>
                </span>
              </span>
            </h2>
          </div>

          {/* 3. Subtext */}
          <p className="text-lg md:text-xl text-navy-light max-w-3xl leading-relaxed mx-auto">
            A fun, hands-on learning journey that helps your child explore, create and grow with real-world technology skills.
          </p>
        </div>

        {/* ========================================== */}
        {/* CAROUSEL SECTION                           */}
        {/* ========================================== */}
        <div
          id="why-choose-carousel"
          className="relative mt-12 sm:mt-16 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop Previous Arrow Button */}
          <button
            onClick={goToPrev}
            type="button"
            className="hidden md:flex absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white text-navy shadow-lg border border-orange-100 hover:bg-orange hover:text-white transition-all duration-300 z-30 items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange group hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous"
          >
            <svg
              className="w-6 h-6 stroke-current stroke-2 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Desktop Next Arrow Button */}
          <button
            onClick={goToNext}
            type="button"
            className="hidden md:flex absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white text-navy shadow-lg border border-orange-100 hover:bg-orange hover:text-white transition-all duration-300 z-30 items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange group hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next"
          >
            <svg
              className="w-6 h-6 stroke-current stroke-2 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Viewport / Track Wrapper */}
          <div className="overflow-hidden w-full py-4 -my-4 px-1">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${cardTranslatePercent}% - ${gapOffset}px))`,
              }}
            >
              {/* CARD 1: Explore AI */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#EEF5FF] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="robotHeadGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#E2EEFC" />
                        </linearGradient>
                        <linearGradient id="robotScreenGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0B1F4D" />
                          <stop offset="100%" stopColor="#142B66" />
                        </linearGradient>
                        <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#00E5FF" floodOpacity="0.8" />
                        </filter>
                      </defs>
                      <circle cx="18" cy="24" r="3" fill="#2F6FD6" />
                      <circle cx="94" cy="30" r="2.5" fill="#FFC21A" />
                      <path d="M12 52 L6 50 M102 54 L96 52" stroke="#4D8DF0" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M88 12 L89.5 17.5 L95 19 L89.5 20.5 L88 26 L86.5 20.5 L81 19 L86.5 17.5 Z" fill="#FFC21A" />
                      <path d="M26 44 C26 22, 84 22, 84 44" stroke="#2F6FD6" strokeWidth="5" strokeLinecap="round" fill="none" />
                      <rect x="18" y="38" width="10" height="24" rx="5" fill="#2F6FD6" stroke="#0B1F4D" strokeWidth="2" />
                      <rect x="82" y="38" width="10" height="24" rx="5" fill="#2F6FD6" stroke="#0B1F4D" strokeWidth="2" />
                      <rect x="25" y="24" width="60" height="52" rx="22" fill="url(#robotHeadGrad1)" stroke="#0B1F4D" strokeWidth="2.5" />
                      <path d="M36 29 C44 26, 66 26, 74 29" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                      <rect x="33" y="36" width="44" height="30" rx="13" fill="url(#robotScreenGrad1)" />
                      <ellipse cx="45" cy="48" rx="4" ry="5" fill="#00E5FF" filter="url(#cyanGlow)" />
                      <ellipse cx="65" cy="48" rx="4" ry="5" fill="#00E5FF" filter="url(#cyanGlow)" />
                      <path d="M48 57 C51 60, 59 60, 62 57" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyanGlow)" />
                      <rect x="42" y="78" width="26" height="14" rx="6" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
                      <rect x="47" y="81" width="16" height="8" rx="3" fill="#FFC21A" />
                      <text x="55" y="87.5" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="7" fill="#0B1F4D" textAnchor="middle">
                        AI
                      </text>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Explore AI</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Understand AI in simple, fun ways with real-world examples.
                  </p>
                </div>
              </div>

              {/* CARD 2: Build & Create */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#FFF3EA] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="laptopBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF7B29" />
                          <stop offset="100%" stopColor="#E5530A" />
                        </linearGradient>
                        <linearGradient id="laptopScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0B1F4D" />
                          <stop offset="100%" stopColor="#1B3A7D" />
                        </linearGradient>
                      </defs>
                      <line x1="8" y1="36" x2="18" y2="38" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="12" y1="48" x2="20" y2="48" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="102" y1="36" x2="92" y2="38" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="98" y1="48" x2="90" y2="48" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="14" cy="24" r="3" fill="#FFC21A" />
                      <circle cx="96" cy="24" r="3" fill="#FFC21A" />
                      <rect x="23" y="20" width="64" height="46" rx="8" fill="url(#laptopBodyGrad)" stroke="#0B1F4D" strokeWidth="2.5" />
                      <rect x="29" y="26" width="52" height="34" rx="4" fill="url(#laptopScreenGrad)" />
                      <circle cx="55" cy="23" r="1.5" fill="#FFFFFF" />
                      <path d="M44 38 L38 43 L44 48" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="57" y1="37" x2="53" y2="49" stroke="#FFC21A" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M66 38 L72 43 L66 48" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 72 L98 72 L90 84 L20 84 Z" fill="#FFE9D9" stroke="#0B1F4D" strokeWidth="2.5" />
                      <rect x="36" y="74" width="38" height="6" rx="2" fill="#F26A1B" />
                      <rect x="48" y="80" width="14" height="3" rx="1.5" fill="#0B1F4D" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Build &amp; Create</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Make real projects, apps and creative solutions.
                  </p>
                </div>
              </div>

              {/* CARD 3: Be Creative */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#EEF8F1] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <radialGradient id="bulbGlowGrad" cx="50%" cy="40%" r="55%">
                          <stop offset="0%" stopColor="#FFF2A3" />
                          <stop offset="55%" stopColor="#FFC21A" />
                          <stop offset="100%" stopColor="#F26A1B" />
                        </radialGradient>
                      </defs>
                      <line x1="55" y1="6" x2="55" y2="14" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="26" y1="20" x2="33" y2="26" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="84" y1="20" x2="77" y2="26" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="14" y1="46" x2="22" y2="46" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <line x1="96" y1="46" x2="88" y2="46" stroke="#F26A1B" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="55" cy="46" r="32" fill="#FFC21A" opacity="0.18" />
                      <path
                        d="M35 58 C28 50, 28 36, 38 26 C48 16, 62 16, 72 26 C82 36, 82 50, 75 58 C70 63, 68 68, 68 74 H42 C42 68, 40 63, 35 58 Z"
                        fill="url(#bulbGlowGrad)"
                        stroke="#0B1F4D"
                        strokeWidth="2.5"
                      />
                      <path d="M42 27 C47 22, 56 22, 60 23" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                      <path
                        d="M47 52 C45 42, 52 38, 55 44 C58 38, 65 42, 63 52"
                        stroke="#FFFFFF"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <rect x="44" y="74" width="22" height="5" rx="2.5" fill="#94A3B8" stroke="#0B1F4D" strokeWidth="2" />
                      <rect x="46" y="79" width="18" height="5" rx="2.5" fill="#64748B" stroke="#0B1F4D" strokeWidth="2" />
                      <path d="M49 84 C49 88, 61 88, 61 84 Z" fill="#0B1F4D" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Be Creative</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Combine technology with art, stories and imagination.
                  </p>
                </div>
              </div>

              {/* CARD 4: Real-World Skills */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#F3EAFE] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="frontPersonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2F6FD6" />
                          <stop offset="100%" stopColor="#14469E" />
                        </linearGradient>
                        <linearGradient id="backPersonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="100%" stopColor="#2563EB" />
                        </linearGradient>
                      </defs>
                      <path d="M86 16 L88 22 L94 24 L88 26 L86 32 L84 26 L78 24 L84 22 Z" fill="#F26A1B" />
                      <circle cx="16" cy="34" r="2.5" fill="#FFC21A" />
                      <line x1="90" y1="42" x2="98" y2="40" stroke="#F26A1B" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="12" y1="48" x2="20" y2="48" stroke="#2F6FD6" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="68" cy="36" r="12" fill="url(#backPersonGrad)" stroke="#0B1F4D" strokeWidth="2.2" />
                      <path d="M52 74 C52 60, 60 54, 72 54 C82 54, 90 60, 90 74 Z" fill="url(#backPersonGrad)" stroke="#0B1F4D" strokeWidth="2.2" />
                      <circle cx="42" cy="40" r="14" fill="url(#frontPersonGrad)" stroke="#0B1F4D" strokeWidth="2.5" />
                      <path d="M38 31 C42 28, 48 28, 51 31" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M22 84 C22 66, 32 60, 48 60 C62 60, 72 66, 72 84 Z" fill="url(#frontPersonGrad)" stroke="#0B1F4D" strokeWidth="2.5" />
                      <path d="M40 60 L48 68 L56 60" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Real-World Skills</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Develop problem-solving, confidence and future-ready skills.
                  </p>
                </div>
              </div>

              {/* CARD 5: Learn Through Play */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#FFF3EA] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="gamepadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF8A3D" />
                          <stop offset="100%" stopColor="#E5530A" />
                        </linearGradient>
                      </defs>
                      <circle cx="16" cy="28" r="3" fill="#FFC21A" />
                      <circle cx="94" cy="24" r="2.5" fill="#2F6FD6" />
                      <line x1="88" y1="16" x2="96" y2="12" stroke="#FFC21A" strokeWidth="2.5" strokeLinecap="round" />
                      <path
                        d="M26 38 C34 32, 76 32, 84 38 C94 45, 96 68, 88 80 C82 88, 70 82, 64 68 C60 62, 50 62, 46 68 C40 82, 28 88, 22 80 C14 68, 16 45, 26 38 Z"
                        fill="url(#gamepadGrad)"
                        stroke="#0B1F4D"
                        strokeWidth="2.5"
                      />
                      <path d="M36 37 C46 34, 64 34, 74 37" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                      <path d="M34 46 H38 V42 H42 V46 H46 V50 H42 V54 H38 V50 H34 Z" fill="#0B1F4D" />
                      <circle cx="70" cy="44" r="3" fill="#2E9E5B" stroke="#0B1F4D" strokeWidth="1.2" />
                      <circle cx="76" cy="48" r="3" fill="#2F6FD6" stroke="#0B1F4D" strokeWidth="1.2" />
                      <circle cx="64" cy="48" r="3" fill="#FFC21A" stroke="#0B1F4D" strokeWidth="1.2" />
                      <circle cx="70" cy="54" r="3" fill="#E5530A" stroke="#0B1F4D" strokeWidth="1.2" />
                      <circle cx="44" cy="62" r="5" fill="#FFE9D9" stroke="#0B1F4D" strokeWidth="1.8" />
                      <circle cx="44" cy="62" r="2.5" fill="#2F6FD6" />
                      <circle cx="66" cy="62" r="5" fill="#FFE9D9" stroke="#0B1F4D" strokeWidth="1.8" />
                      <circle cx="66" cy="62" r="2.5" fill="#2F6FD6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Learn Through Play</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Games and activities that make every concept easy to remember.
                  </p>
                </div>
              </div>

              {/* CARD 6: Smart Prompting */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#EEF5FF] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4D8DF0" />
                          <stop offset="100%" stopColor="#2F6FD6" />
                        </linearGradient>
                      </defs>
                      <circle cx="16" cy="38" r="3" fill="#FFC21A" />
                      <circle cx="94" cy="32" r="2.5" fill="#F26A1B" />
                      <line x1="88" y1="20" x2="96" y2="18" stroke="#4D8DF0" strokeWidth="2.5" strokeLinecap="round" />
                      <path
                        d="M22 28 C22 18, 88 18, 88 28 C92 48, 88 64, 76 68 L68 78 L58 68 C28 68, 18 56, 22 28 Z"
                        fill="url(#bubbleGrad)"
                        stroke="#0B1F4D"
                        strokeWidth="2.5"
                      />
                      <path d="M32 26 C45 22, 70 22, 78 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                      <g transform="translate(54, 44)">
                        <path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z" fill="#FFC21A" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                        <circle cx="-12" cy="-10" r="2" fill="#FFFFFF" />
                        <circle cx="13" cy="9" r="1.8" fill="#FFC21A" />
                      </g>
                      <line x1="34" y1="56" x2="48" y2="56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="60" y1="56" x2="74" y2="56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Smart Prompting</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Learn how to talk to AI tools safely and smartly.
                  </p>
                </div>
              </div>

              {/* CARD 7: Safe Tech Habits */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#EEF8F1] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38B369" />
                          <stop offset="100%" stopColor="#1F6E3F" />
                        </linearGradient>
                      </defs>
                      <circle cx="16" cy="30" r="3" fill="#2E9E5B" />
                      <circle cx="94" cy="36" r="2.5" fill="#FFC21A" />
                      <path d="M88 16 L89.5 21 L95 22.5 L89.5 24 L88 29 L86.5 24 L81 22.5 L86.5 21 Z" fill="#2E9E5B" />
                      <path
                        d="M55 18 C74 18, 86 24, 86 36 C86 64, 68 82, 55 90 C42 82, 24 64, 24 36 C24 24, 36 18, 55 18 Z"
                        fill="url(#shieldGrad)"
                        stroke="#0B1F4D"
                        strokeWidth="2.5"
                      />
                      <path d="M55 24 C68 24, 76 28, 78 36 C78 58, 65 72, 55 78 C55 42, 55 24, 55 24 Z" fill="#FFFFFF" opacity="0.22" />
                      <path d="M36 28 C44 24, 66 24, 74 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="55" cy="52" r="15" fill="#FFFFFF" stroke="#0B1F4D" strokeWidth="2" />
                      <path d="M48 52 L53 57 L63 46" stroke="#2E9E5B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Safe Tech Habits</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Build healthy, responsible and safe screen habits.
                  </p>
                </div>
              </div>

              {/* CARD 8: Certificate & Showcase */}
              <div className="w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 bg-[#F3EAFE] rounded-3xl p-7 sm:p-8 text-center border border-white shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between group">
                <div className="w-full flex flex-col items-center">
                  <div className="h-28 w-28 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <svg width="104" height="104" viewBox="0 0 110 110" fill="none">
                      <defs>
                        <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFD700" />
                          <stop offset="60%" stopColor="#FFB300" />
                          <stop offset="100%" stopColor="#F26A1B" />
                        </linearGradient>
                        <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#475569" />
                          <stop offset="100%" stopColor="#1E293B" />
                        </linearGradient>
                      </defs>
                      <path d="M18 16 L20 22 L26 24 L20 26 L18 32 L16 26 L10 24 L16 22 Z" fill="#FFC21A" />
                      <circle cx="92" cy="24" r="3" fill="#F26A1B" />
                      <circle cx="16" cy="48" r="2.5" fill="#2F6FD6" />
                      <path d="M34 32 C18 32, 16 54, 34 58" stroke="#F26A1B" strokeWidth="5" strokeLinecap="round" fill="none" />
                      <path d="M76 32 C92 32, 94 54, 76 58" stroke="#F26A1B" strokeWidth="5" strokeLinecap="round" fill="none" />
                      <path d="M34 32 C18 32, 16 54, 34 58" stroke="#FFC21A" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <path d="M76 32 C92 32, 94 54, 76 58" stroke="#FFC21A" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <path
                        d="M32 20 H78 V46 C78 60, 66 68, 55 68 C44 68, 32 60, 32 46 Z"
                        fill="url(#trophyGrad)"
                        stroke="#0B1F4D"
                        strokeWidth="2.5"
                      />
                      <path d="M36 24 H74" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                      <path
                        d="M55 35 L57.5 42 L65 42 L59 47 L61.5 54 L55 50 L48.5 54 L51 47 L45 42 L52.5 42 Z"
                        fill="#FFFFFF"
                        stroke="#0B1F4D"
                        strokeWidth="1.5"
                      />
                      <rect x="50" y="68" width="10" height="10" fill="#E5530A" stroke="#0B1F4D" strokeWidth="2" />
                      <path d="M38 78 H72 L76 88 H34 Z" fill="url(#pedestalGrad)" stroke="#0B1F4D" strokeWidth="2.5" />
                      <rect x="30" y="88" width="50" height="4" rx="2" fill="#0B1F4D" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-2.5">Certificate &amp; Showcase</h3>
                  <p className="text-base sm:text-lg text-navy-light leading-relaxed">
                    Present projects and earn a certificate of completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Pagination Dots */}
          <div className="hidden md:flex items-center justify-center gap-2.5 mt-8 select-none" aria-label="Carousel pagination">
            {pageIndices.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  currentPage === idx ? "w-8 bg-orange" : "w-3 bg-navy/20 hover:bg-navy/40"
                }`}
              />
            ))}
          </div>

          {/* Mobile Controls: Prev Button, Mobile Dots, Next Button */}
          <div className="flex md:hidden items-center justify-center gap-4 mt-8 select-none">
            <button
              onClick={goToPrev}
              type="button"
              className="w-11 h-11 rounded-full bg-white text-navy shadow-md border border-orange-100 flex items-center justify-center hover:bg-orange hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange active:scale-90 cursor-pointer"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2" aria-label="Mobile carousel pagination">
              {pageIndices.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentPage === idx ? "w-6 bg-orange" : "w-2.5 bg-navy/25"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              type="button"
              className="w-11 h-11 rounded-full bg-white text-navy shadow-md border border-orange-100 flex items-center justify-center hover:bg-orange hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange active:scale-90 cursor-pointer"
              aria-label="Next"
            >
              <svg className="w-5 h-5 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
