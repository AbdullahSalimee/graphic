"use client";

import BgStars from "./BgStars";
import Cursor from "./Cursor";
import Nav from "./Nav";
import Hero from "./Hero";
import Marquee from "./Marquee";
import HowItWorks from "./HowItWorks";
import Benefits from "./Benefits";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage({ onLaunch }) {
  return (
    <div className="min-h-screen  text-slate-200 overflow-x-hidden">
      <BgStars />
      <Cursor />
      <Nav onLaunch={onLaunch} />
      <Hero onLaunch={onLaunch} />
      <Marquee />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CTA onLaunch={onLaunch} />
      <Footer />
    </div>
  );
}
