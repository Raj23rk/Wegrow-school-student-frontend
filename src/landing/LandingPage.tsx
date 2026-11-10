import React from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import WhyChooseCarousel from "./WhyChooseCarousel";
import CourseDetails from "./CourseDetails";
import Footer from "./Footer";

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenWorkshop?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenWorkshop }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream font-nunito text-navy-light overflow-x-hidden">
      {/* Workshop Announcement Strip */}
      {onOpenWorkshop && (
        <div className="bg-gradient-to-r from-[#0B1F4D] via-[#1A3675] to-[#F26A1B] text-white px-4 py-2 text-center text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-inner">
          <span className="animate-pulse">🔥</span>
          <span>WebSpark AI Workshop: Build Your Own Website with AI! (28 Nov 2026, 5-7 PM)</span>
          <span className="hidden sm:inline">&bull; Fee: ₹99 Only</span>
          <button
            onClick={onOpenWorkshop}
            className="ml-2 bg-[#FFC21A] text-[#0B1F4D] px-3 py-0.5 rounded-full text-xs font-black hover:bg-white transition cursor-pointer shadow-sm"
          >
            Register Now ➔
          </button>
        </div>
      )}

      {/* 1) STICKY NAVBAR */}
      <Navbar onOpenLogin={onOpenLogin} onOpenWorkshop={onOpenWorkshop} />

      {/* 2) MAIN CONTENT SECTIONS */}
      <main id="home" className="flex-grow flex flex-col w-full overflow-x-hidden">
        {/* HERO SECTION */}
        <Hero onOpenLogin={onOpenLogin} />

        {/* WHY CHOOSE THIS PROGRAM CAROUSEL SECTION */}
        <div id="what-kids-learn">
          <WhyChooseCarousel />
        </div>

        {/* WHY CHOOSE WEGROW & COURSE DETAILS SECTION */}
        <div id="course-details">
          <CourseDetails onOpenLogin={onOpenLogin} />
        </div>
      </main>

      {/* 3) WEGROW SIVAKASI FOOTER */}
      <Footer />
    </div>
  );
};
