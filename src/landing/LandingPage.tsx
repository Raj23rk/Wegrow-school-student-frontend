import React from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import WhyChooseCarousel from "./WhyChooseCarousel";
import CourseDetails from "./CourseDetails";
import Footer from "./Footer";

interface LandingPageProps {
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream font-nunito text-navy-light overflow-x-hidden">
      {/* 1) STICKY NAVBAR */}
      <Navbar onOpenLogin={onOpenLogin} />

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
