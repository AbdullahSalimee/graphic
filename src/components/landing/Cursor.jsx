"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef();
  const ring = useRef();
  const pos = useRef({ x: -100, y: -100 });
  const lag = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move);
    let raf;
    const loop = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.14;
      lag.current.y += (pos.current.y - lag.current.y) * 0.14;
      if (dot.current) {
        dot.current.style.left = pos.current.x + "px";
        dot.current.style.top = pos.current.y + "px";
      }
      if (ring.current) {
        ring.current.style.left = lag.current.x + "px";
        ring.current.style.top = lag.current.y + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="fixed w-1.5 h-1.5 rounded-full bg-black pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#38bdf8]"
      />
      <div
        ref={ring}
        className="fixed w-8 h-8 rounded-full border border-cyan-900 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-300"
      />
    </>
  );
}
