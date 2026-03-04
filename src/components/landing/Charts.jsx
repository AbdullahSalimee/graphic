"use client";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   BOX 1 – Animated Input Bar UI
───────────────────────────────────────────── */
const TYPED_TEXT = "Make a 3D bar chart of monthly sales";

export function BarSVG() {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const [chartType] = useState("Bar Chart");

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(TYPED_TEXT.slice(0, i));
      if (i >= TYPED_TEXT.length) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "18px",
        fontFamily: "'SF Pro Display', -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(148,163,184,0.6)",
          marginBottom: "4px",
        }}
      >
        Graphy AI · Chart Generator
      </div>

      <div
        style={{
          width: "92%",
          background: "rgba(15,23,42,0.85)",
          border: "1.5px solid rgba(56,189,248,0.25)",
          borderRadius: "14px",
          padding: "13px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow:
            "0 0 0 1px rgba(56,189,248,0.08), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg,transparent,rgba(56,189,248,0.5),transparent)",
          }}
        />
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(100,116,139,0.7)"
          strokeWidth="2"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: "8px",
            padding: "3px 8px",
            fontSize: "0.6rem",
            color: "rgba(56,189,248,0.85)",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {chartType}
        </div>
        <div
          style={{
            flex: 1,
            fontSize: "0.72rem",
            color: "rgba(226,232,240,0.9)",
            letterSpacing: "0.01em",
            minHeight: "16px",
            lineHeight: 1.4,
          }}
        >
          {displayed}
          <span
            style={{
              display: "inline-block",
              width: "1.5px",
              height: "0.75em",
              background: "rgba(56,189,248,0.9)",
              marginLeft: "1px",
              verticalAlign: "middle",
              opacity: cursor ? 1 : 0,
              transition: "opacity 0.1s",
            }}
          />
        </div>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, rgba(56,189,248,0.9), rgba(99,102,241,0.8))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 12px rgba(56,189,248,0.3)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "7px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["Monthly sales", "User growth", "Revenue Q4"].map((chip, i) => (
          <div
            key={chip}
            style={{
              fontSize: "0.55rem",
              padding: "4px 10px",
              borderRadius: "100px",
              border: "1px solid rgba(100,116,139,0.2)",
              color: "rgba(148,163,184,0.6)",
              background: "rgba(15,23,42,0.4)",
              letterSpacing: "0.04em",
              animation: `fadeUpChip 0.5s ease ${0.8 + i * 0.12}s both`,
            }}
          >
            {chip}
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeUpChip{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOX 2 – Gorgeous Loading Animation
───────────────────────────────────────────── */
export function LineSVG() {
  const [tick, setTick] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Parsing dataset…",
    "Detecting patterns…",
    "Choosing chart type…",
    "Rendering visuals…",
  ];

  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += 0.4;
      if (p > 100) p = 0;
      setProgress(p);
      setStepIndex(Math.floor((p / 100) * steps.length) % steps.length);
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const NUM_DOTS = 8;
  const orbitR = 36;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "18px",
        fontFamily: "'SF Pro Display', -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(56,189,248,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Central orb */}
      <div
        style={{
          position: "relative",
          width: "96px",
          height: "96px",
          flexShrink: 0,
        }}
      >
        {/* Outer slow-spin dashed ring */}
        <svg
          width="96"
          height="96"
          style={{
            position: "absolute",
            inset: 0,
            animation: "orb-spin 7s linear infinite",
          }}
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="rgba(56,189,248,0.12)"
            strokeWidth="1"
            strokeDasharray="3 9"
          />
        </svg>

        {/* Counter-rotating inner ring */}
        <svg
          width="96"
          height="96"
          style={{
            position: "absolute",
            inset: 0,
            animation: "orb-spin 4.5s linear infinite reverse",
          }}
        >
          <circle
            cx="48"
            cy="48"
            r="36"
            fill="none"
            stroke="rgba(99,102,241,0.18)"
            strokeWidth="1"
            strokeDasharray="2 7"
          />
        </svg>

        {/* Orbit track */}
        <svg width="96" height="96" style={{ position: "absolute", inset: 0 }}>
          <circle
            cx="48"
            cy="48"
            r={orbitR}
            fill="none"
            stroke="rgba(56,189,248,0.05)"
            strokeWidth="1"
          />
        </svg>

        {/* Orbiting dots */}
        {Array.from({ length: NUM_DOTS }).map((_, i) => {
          const angle = ((tick * 2.2 + (i * 360) / NUM_DOTS) * Math.PI) / 180;
          const x = 48 + orbitR * Math.cos(angle);
          const y = 48 + orbitR * Math.sin(angle);
          const size = 1.8 + (i / NUM_DOTS) * 2.8;
          const opacity = 0.25 + 0.75 * (i / NUM_DOTS);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                background:
                  i % 2 === 0
                    ? "rgba(56,189,248,0.95)"
                    : "rgba(99,102,241,0.95)",
                transform: "translate(-50%,-50%)",
                boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? "rgba(56,189,248,0.7)" : "rgba(99,102,241,0.7)"}`,
                opacity,
              }}
            />
          );
        })}

        {/* Arc progress ring */}
        <svg width="96" height="96" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="arcG2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.9)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.9)" />
            </linearGradient>
          </defs>
          <circle
            cx="48"
            cy="48"
            r="26"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3"
          />
          <circle
            cx="48"
            cy="48"
            r="26"
            fill="none"
            stroke="url(#arcG2)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 163.4} 163.4`}
            transform="rotate(-90 48 48)"
          />
        </svg>

        {/* Glowing core */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 38%, rgba(56,150,248,0.9), rgba(99,102,241,0.75) 55%, rgba(15,23,42,0.95))",
            boxShadow:
              "0 0 18px rgba(56,189,248,0.55), 0 0 36px rgba(56,189,248,0.22), inset 0 1px 0 rgba(255,255,255,0.18)",
            animation: "core-pulse 2.2s ease-in-out infinite",
          }}
        />

        {/* Spinning icon inside */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "orb-spin 3.5s linear infinite",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2.2"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
      </div>

      {/* Text section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          width: "86%",
          color: "black",
        }}
      >
        {/* Cycling step label */}
        <div
          key={stepIndex}
          style={{
            fontSize: "0.62rem",
            color: "black",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            animation: "fadeSlide 0.35s ease both",
          }}
        >
          {steps[stepIndex]}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "2px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.05)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "100px",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg,rgba(56,189,248,0.85),rgba(99,102,241,0.9))",
              boxShadow: "0 0 10px rgba(56,189,248,0.7)",
              transition: "width 0.03s linear",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "-1px",
                top: "-3px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "rgba(56,189,248,0.95)",
                boxShadow:
                  "0 0 8px rgba(56,189,248,1), 0 0 16px rgba(56,189,248,0.5)",
              }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div
          style={{
            fontSize: "0.55rem",
            color: "rgba(56,189,248,0.65)",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          {Math.round(progress)}%
        </div>

        {/* Shimmer skeleton lines */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginTop: "2px",
          }}
        >
          {[90, 68, 48].map((w, i) => (
            <div
              key={i}
              style={{
                height: "4px",
                borderRadius: "100px",
                width: `${w}%`,
                background: "rgba(255,255,255,0.05)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg,transparent 0%,rgba(56,189,200,0.18) 50%,transparent 100%)",
                  animation: `shimmer 2s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOX 3 – Plotly 3D Chart
───────────────────────────────────────────── */
export function DonutSVG() {
  const ref = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;

    const loadPlotly = () => {
      if (window.Plotly) {
        renderChart();
        return;
      }
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.27.1/plotly.min.js";
      script.onload = renderChart;
      document.head.appendChild(script);
    };

    const renderChart = () => {
      if (!ref.current || !window.Plotly) return;
      loaded.current = true;

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const products = ["Alpha", "Beta", "Gamma"];
      const zData = products.map(() =>
        months.map(() => Math.round(30 + Math.random() * 65)),
      );

      const trace3d = {
        type: "surface",
        z: zData,
        x: months,
        y: products,
        colorscale: [
          [0, "rgba(15,23,42,0.9)"],
          [0.25, "rgba(99,102,241,0.8)"],
          [0.6, "rgba(56,189,248,0.85)"],
          [1, "rgba(236,72,153,0.95)"],
        ],
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: "rgba(56,189,248,0.4)",
            project: { z: false },
          },
        },
        opacity: 0.92,
        showscale: false,
        lighting: {
          ambient: 0.6,
          diffuse: 0.8,
          specular: 0.5,
          roughness: 0.4,
          fresnel: 0.4,
        },
        lightposition: { x: 100, y: 200, z: 150 },
      };

      const layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        margin: { l: 0, r: 0, t: 0, b: 0 },
        scene: {
          bgcolor: "rgba(0,0,0,0)",
          xaxis: {
            showgrid: true,
            gridcolor: "rgba(56,189,248,0.1)",
            tickfont: { color: "rgba(148,163,184,0.7)", size: 8 },
            zeroline: false,
          },
          yaxis: {
            showgrid: true,
            gridcolor: "rgba(99,102,241,0.1)",
            tickfont: { color: "rgba(148,163,184,0.7)", size: 8 },
            tickvals: [0, 1, 2],
            ticktext: products,
            zeroline: false,
          },
          zaxis: {
            showgrid: true,
            gridcolor: "rgba(255,255,255,0.05)",
            tickfont: { color: "rgba(148,163,184,0.7)", size: 8 },
            zeroline: false,
          },
          camera: {
            eye: { x: 1.6, y: -1.6, z: 1.2 },
            center: { x: 0, y: 0, z: -0.1 },
          },
          aspectmode: "manual",
          aspectratio: { x: 1.5, y: 0.8, z: 0.7 },
        },
        showlegend: false,
      };

      window.Plotly.newPlot(ref.current, [trace3d], layout, {
        displayModeBar: false,
        responsive: true,
        scrollZoom: false,
      });

      let angle = 0;
      const rotate = setInterval(() => {
        if (!ref.current) {
          clearInterval(rotate);
          return;
        }
        angle += 0.4;
        const rad = (angle * Math.PI) / 180;
        const r = 1.8;
        window.Plotly.relayout(ref.current, {
          "scene.camera": {
            eye: { x: r * Math.cos(rad), y: r * Math.sin(rad), z: 1.1 },
            center: { x: 0, y: 0, z: -0.1 },
          },
        });
      }, 50);
    };

    loadPlotly();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "6px",
          left: "10px",
          zIndex: 10,
          fontSize: "0.5rem",
          color: "black",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        3D Surface · Live
      </div>
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
