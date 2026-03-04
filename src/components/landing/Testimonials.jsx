"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "./useReveal";

const TESTI = [
  {
    name: "Sarah Chen",
    role: "Head of Analytics · Stripe",
    text: "I went from hours of Excel hell to a beautiful chart in 30 seconds. Absolute game changer.",
  },
  {
    name: "Marcus Reid",
    role: "CEO · Launchpad Ventures",
    text: "Our board presentations look like they came from a design agency. Nobody believes we made them ourselves.",
  },
  {
    name: "Aisha Kamara",
    role: "Data Lead · Shopify",
    text: "The AI understands my data intuitively. It picked the right chart type before I even had to ask.",
  },
  {
    name: "Tom Nguyen",
    role: "Founder · Clearpath",
    text: "5 days of reporting done in 4 hours. My team thought I'd hired a data scientist.",
  },
  {
    name: "Priya Sharma",
    role: "Product Manager · Linear",
    text: "Finally a tool that makes data beautiful without requiring a PhD in design.",
  },
  {
    name: "James Okafor",
    role: "CFO · Seedbank",
    text: "Our investors commented on how clear and beautiful our charts were. Never happened before.",
  },
];

const AVATAR_COLORS = [
  "bg-blue-500 border border-blue-400",
  "bg-violet-500 border border-violet-400",
  "bg-teal-500 border border-teal-400",
  "bg-indigo-500 border border-indigo-400",
  "bg-purple-500 border border-purple-400",
  "bg-cyan-500 border border-cyan-400",
];

/* Fires once when element scrolls into view */
function useFadeUp(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(36px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
  };

  return [ref, style];
}

function TestiCard({ t, i }) {
  const revealRef = useReveal();
  const [fadeRef, fadeStyle] = useFadeUp(i * 0.08);

  return (
    <div
      ref={(el) => {
        revealRef.current = el;
        fadeRef.current = el;
      }}
      style={fadeStyle}
      className="relative bg-white border border-slate-200 rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:border-sky-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(14,165,233,0.12)] group"
    >
      {/* top shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

      <div className="text-sky-400 text-[0.8rem] tracking-widest mb-4">
        ★★★★★
      </div>

      <p className="font-playfair italic text-slate-600 leading-[1.7] mb-5">
        "{t.text}"
      </p>

      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-sans text-[0.88rem] font-bold text-white shrink-0 ${AVATAR_COLORS[i]}`}
        >
          {t.name[0]}
        </div>
        <div>
          <div className="font-sans text-[0.84rem] font-semibold text-slate-800">
            {t.name}
          </div>
          <div className="font-mono text-[0.65rem] text-slate-400 tracking-wide">
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useReveal();
  const [headRef, headStyle] = useFadeUp(0);

  return (
    <section className="relative z-10 px-8 py-24 ">
      {/* Subtle decorative circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-100 rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div
        ref={(el) => {
          ref.current = el;
          headRef.current = el;
        }}
        style={headStyle}
        className="text-center mb-16"
      >
        <div className="font-mono text-[0.63rem] tracking-[0.16em] uppercase text-sky-500 opacity-75 mb-5">
          Wall of love
        </div>
        <h2
          className="font-playfair font-bold text-slate-800 tracking-tight leading-[1.1] mb-5"
          style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)" }}
        >
          Loved by <em className="not-italic text-sky-500">data people</em>
        </h2>
        <p className="font-sans text-slate-500 leading-[1.8] max-w-[400px] mx-auto">
          Join thousands who've made data storytelling effortless.
        </p>
      </div>

      <div
        className="grid gap-5 max-w-[1100px] mx-auto"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
      >
        {TESTI.map((t, i) => (
          <TestiCard key={i} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}
