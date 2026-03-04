"use client";

import { useState, useEffect } from "react";

const PHRASES = [
  "Show monthly revenue vs expenses for 2024",
  "Compare top 10 countries by GDP",
  "Plot BTC price over the last 12 months",
  "Visualize sales funnel conversion rates",
  "Show user growth broken down by region",
];

export default function Typewriter() {
  const [text, setText] = useState("");
  const [pi, setPi] = useState(0);

  useEffect(() => {
    let i = 0,
      del = false,
      t;
    const tick = () => {
      const ph = PHRASES[pi];
      if (!del) {
        setText(ph.slice(0, ++i));
        if (i === ph.length) {
          del = true;
          t = setTimeout(tick, 1800);
          return;
        }
      } else {
        setText(ph.slice(0, --i));
        if (i === 0) {
          del = false;
          setPi((p) => (p + 1) % PHRASES.length);
        }
      }
      t = setTimeout(tick, del ? 24 : 50);
    };
    t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, [pi]);

  return (
    <>
      {text}
      <span className="inline-block w-px h-[1em] bg-accent ml-0.5 align-middle animate-blink" />
    </>
  );
}
