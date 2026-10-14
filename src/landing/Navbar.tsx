import React, { useState, useEffect } from "react";

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isDrawerOpen]);

  return (
    <>
      {/* NAVBAR (Sticky, 80px, Backdrop-Blur) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100/70 shadow-[0_4px_20px_-4px_rgba(11,31,77,0.06)]">
        <nav
          className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* Left: Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-orange/40 rounded-xl p-1"
            aria-label="WeGrow Skill Campus & B School, Sivakasi Home"
          >
            <div className="relative h-10 sm:h-12 w-auto flex items-center">
              <img
                src="/wegrow-logo.webp"
                alt="WeGrow Skill Campus & B School"
                width={176}
                height={48}
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo copy.png";
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col pl-2.5 border-l-2 border-orange/50 text-left leading-none">
              <span className="text-[12px] font-black text-navy tracking-wider uppercase">
                &amp; B School
              </span>
              <span className="text-[9px] font-extrabold text-orange tracking-widest uppercase mt-1">
                SIVAKASI
              </span>
            </div>
          </a>

          {/* Center Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-7 lg:gap-9 text-[15px] font-semibold text-navy">
            <a
              href="#home"
              className="relative text-orange font-bold py-1 transition-colors"
              aria-current="page"
            >
              Home
              <span
                className="absolute bottom-0 left-0 w-full h-[3px] bg-orange rounded-full"
                aria-hidden="true"
              ></span>
            </a>
            <a
              href="#what-kids-learn"
              className="py-1 hover:text-orange transition-colors"
            >
              What Kids Learn
            </a>
            <a
              href="#course-benefits"
              className="py-1 hover:text-orange transition-colors"
            >
              Course Benefits
            </a>
            <a
              href="#course-details"
              className="py-1 hover:text-orange transition-colors"
            >
              Course Details
            </a>
            <a href="#faqs" className="py-1 hover:text-orange transition-colors">
              FAQs
            </a>
          </div>

          {/* Right: Student Login Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F7781F] to-[#E5530A] text-white font-extrabold text-[15px] rounded-xl px-7 py-3 shadow-lg shadow-orange-300/40 hover:shadow-orange-400/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
              </svg>
              <span>Student Login</span>
              <span
                className="transform group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2.5 rounded-xl text-navy bg-orange-light/50 hover:bg-orange-light focus:outline-none focus:ring-2 focus:ring-orange transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isDrawerOpen}
              aria-label="Open Navigation Menu"
            >
              <svg
                className="w-6 h-6 stroke-current stroke-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE OFF-CANVAS DRAWER */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 bg-navy/60 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        aria-label="Mobile Navigation"
        className={`fixed top-0 left-0 bottom-0 h-full w-[84%] max-w-xs sm:max-w-sm bg-white z-[60] shadow-2xl border-r border-orange-100 flex flex-col justify-between p-6 overflow-y-auto transform transition-transform duration-300 ease-out md:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <img
                src="/wegrow-logo.webp"
                alt="WeGrow Skill Campus"
                width={140}
                height={36}
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo copy.png";
                }}
              />
              <span className="text-[10px] font-black text-orange uppercase tracking-wider pl-2 border-l border-orange/40">
                Sivakasi
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-navy/70 hover:text-orange rounded-lg"
              aria-label="Close Menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-6">
            <a
              href="#home"
              onClick={() => setIsDrawerOpen(false)}
              className="p-3 font-extrabold text-orange rounded-xl bg-orange-light/50 text-base"
            >
              Home
            </a>
            <a
              href="#what-kids-learn"
              onClick={() => setIsDrawerOpen(false)}
              className="p-3 font-bold text-navy hover:text-orange hover:bg-orange-light/20 rounded-xl text-base transition-colors"
            >
              What Kids Learn
            </a>
            <a
              href="#course-benefits"
              onClick={() => setIsDrawerOpen(false)}
              className="p-3 font-bold text-navy hover:text-orange hover:bg-orange-light/20 rounded-xl text-base transition-colors"
            >
              Course Benefits
            </a>
            <a
              href="#course-details"
              onClick={() => setIsDrawerOpen(false)}
              className="p-3 font-bold text-navy hover:text-orange hover:bg-orange-light/20 rounded-xl text-base transition-colors"
            >
              Course Details
            </a>
            <a
              href="#faqs"
              onClick={() => setIsDrawerOpen(false)}
              className="p-3 font-bold text-navy hover:text-orange hover:bg-orange-light/20 rounded-xl text-base transition-colors"
            >
              FAQs
            </a>
          </nav>
        </div>

        <div className="pt-6 border-t border-orange-100">
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              onOpenLogin();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7781F] to-[#E5530A] text-white font-extrabold text-base py-3.5 rounded-xl shadow-lg shadow-orange-300/40"
          >
            <span>Student Login Portal</span>
            <span>→</span>
          </button>
        </div>
      </aside>
    </>
  );
};
