"use client";

import { useEffect, useRef } from "react";
import useReveal from "./useReveal";
import { Bars3DChart } from "./Hero";
import { GlowAreaChart } from "./Hero";
import { RichDonut } from "./Hero";
import { BeautifulHeatmap } from "./Hero";

function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let W, H;

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.004 + 0.001,
      offset: Math.random() * Math.PI * 2,
    }));

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const pulse =
          s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.offset));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${pulse})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

export default function CTA({ onLaunch }) {
  const ref = useReveal();

  return (
    <section
      className="relative z-10 px-8 py-36 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #081220 100%)",
      }}
    >
      {/* Starfield */}
      <StarCanvas />

      {/* Soft horizon glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "180px",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(56,189,248,0.07), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(56,189,248,0.06),transparent_70%)] pointer-events-none" />

      <Bars3DChart className="chart-3" />
      <GlowAreaChart className="chart-6" />
      <RichDonut className="chart-8" />
      <BeautifulHeatmap className="chart-7" />

      <div ref={ref} style={{ position: "relative", zIndex: 10 }}>
        <div className="font-mono text-[0.63rem] tracking-[0.16em] uppercase text-sky-400 opacity-75 mb-8">
          Get started today
        </div>
        <h2
          className="font-playfair font-bold text-slate-200 tracking-tight leading-[0.97] mb-6"
          style={{ fontSize: "clamp(3rem,7vw,6.5rem)" }}
        >
          Start making
          <br />
          <em className="not-italic text-sky-400">beautiful charts</em>
          <br />
          right now.
        </h2>
        <p className="font-sans text-slate-400 leading-[1.8] mb-10">
          Free to use. No signup. 87 chart types. Instant results.
        </p>
        <button
          onClick={onLaunch}
          className="btn-sheen px-11 py-4 text-[1.05rem] bg-gradient-to-r from-sky-700 to-sky-600 text-white font-sans font-semibold rounded-xl tracking-wide shadow-[0_4px_32px_rgba(56,189,248,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(56,189,248,0.35)]"
        >
          Launch Graphy AI →
        </button>
      </div>
    </section>
  );
}
