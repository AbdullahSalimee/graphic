"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// ── Colour palettes ───────────────────────────────────────────────────────────
const PALETTES = [
  {
    id: "ocean",
    label: "Ocean",
    colors: ["#38bdf8", "#818cf8", "#34d399", "#f472b6", "#fb923c", "#a78bfa"],
  },
  {
    id: "fire",
    label: "Fire",
    colors: ["#f97316", "#ef4444", "#eab308", "#f43f5e", "#fb923c", "#fbbf24"],
  },
  {
    id: "forest",
    label: "Forest",
    colors: ["#4ade80", "#86efac", "#6ee7b7", "#a3e635", "#34d399", "#bef264"],
  },
  {
    id: "galaxy",
    label: "Galaxy",
    colors: ["#a78bfa", "#c084fc", "#818cf8", "#e879f9", "#7dd3fc", "#f0abfc"],
  },
  {
    id: "mono",
    label: "Mono",
    colors: ["#f8fafc", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155"],
  },
  {
    id: "neon",
    label: "Neon",
    colors: ["#00ff88", "#00e5ff", "#ff00c8", "#ffe600", "#ff4400", "#8800ff"],
  },
];

const CONVERT_TYPES = [
  { id: "bar", label: "Bar", icon: "▐" },
  { id: "line", label: "Line", icon: "〜" },
  { id: "pie", label: "Pie", icon: "◉" },
  { id: "scatter", label: "Scatter", icon: "⁙" },
  { id: "area", label: "Area", icon: "△" },
  { id: "histogram", label: "Histogram", icon: "⬛" },
];

const EXPORT_FORMATS = ["PNG", "SVG", "JPEG"];

// ── Portal popup: escapes all overflow containers, floats above the button ────
function PortalPopup({ anchorRef, open, children }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({
      // fixed position — viewport-relative, above the button
      top: r.top - 8,
      left: r.left + r.width / 2,
    });
  }, [open]);

  if (!open || typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, -100%)",
        background: "rgba(8,14,28,0.98)",
        border: "1px solid rgba(56,189,248,0.22)",
        borderRadius: "12px",
        padding: "10px",
        zIndex: 99999,
        minWidth: "200px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 -4px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.05)",
        pointerEvents: "auto",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

// ── Tooltip: also via portal so it never clips ────────────────────────────────
function Tip({ children, label }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ top: r.top - 6, left: r.left + r.width / 2 });
      }}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -100%)",
              background: "rgba(8,14,26,0.97)",
              border: "1px solid rgba(56,189,248,0.18)",
              color: "#94a3b8",
              fontSize: "0.68rem",
              padding: "3px 9px",
              borderRadius: "5px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 99999,
              letterSpacing: "0.03em",
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "22px",
        background: "rgba(255,255,255,0.07)",
        flexShrink: 0,
        margin: "0 2px",
      }}
    />
  );
}

function PopLabel({ children }) {
  return (
    <div
      style={{
        color: "#475569",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "8px",
        padding: "0 2px",
      }}
    >
      {children}
    </div>
  );
}

// ── Main toolbar ──────────────────────────────────────────────────────────────
export default function ChartToolbar({ divRef, message }) {
  const [activePalette, setActivePalette] = useState(null);
  const [showPalette, setShowPalette] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [gridOn, setGridOn] = useState(true);
  const [legendOn, setLegendOn] = useState(true);
  const [bgDark, setBgDark] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeConvert, setActiveConvert] = useState(null);
  const [labelOn, setLabelOn] = useState(false);

  const convertBtnRef = useRef(null);
  const paletteBtnRef = useRef(null);
  const exportBtnRef = useRef(null);

  const closeAll = useCallback(() => {
    setShowPalette(false);
    setShowExport(false);
    setShowConvert(false);
  }, []);

  useEffect(() => {
    const h = (e) => {
      const inside = [convertBtnRef, paletteBtnRef, exportBtnRef].some((r) =>
        r.current?.contains(e.target),
      );
      if (!inside) closeAll();
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [closeAll]);

  // ── Chart mutations ────────────────────────────────────────────────────────
  const applyPalette = (palette) => {
    if (!divRef.current || !window.Plotly) return;
    setActivePalette(palette.id);
    setShowPalette(false);
    (divRef.current.data || []).forEach((trace, i) => {
      const c = palette.colors[i % palette.colors.length];
      window.Plotly.restyle(
        divRef.current,
        trace.type === "pie"
          ? { "marker.colors": [palette.colors] }
          : { "marker.color": [c], "line.color": [c] },
        [i],
      );
    });
  };

  const toggleGrid = () => {
    if (!divRef.current || !window.Plotly) return;
    const n = !gridOn;
    setGridOn(n);
    window.Plotly.relayout(divRef.current, {
      "xaxis.showgrid": n,
      "yaxis.showgrid": n,
      "xaxis.zeroline": n,
      "yaxis.zeroline": n,
    });
  };

  const toggleLegend = () => {
    if (!divRef.current || !window.Plotly) return;
    const n = !legendOn;
    setLegendOn(n);
    window.Plotly.relayout(divRef.current, { showlegend: n });
  };

  const toggleBg = () => {
    if (!divRef.current || !window.Plotly) return;
    const n = !bgDark;
    setBgDark(n);
    window.Plotly.relayout(divRef.current, {
      paper_bgcolor: n ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.04)",
      plot_bgcolor: n ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.03)",
    });
  };

  const toggleLabels = () => {
    if (!divRef.current || !window.Plotly) return;
    const n = !labelOn;
    setLabelOn(n);
    (divRef.current.data || []).forEach((_, i) =>
      window.Plotly.restyle(
        divRef.current,
        {
          textposition: [n ? "outside" : "none"],
          textinfo: [n ? "label+percent" : "label"],
        },
        [i],
      ),
    );
  };

  const convertChart = (type) => {
    if (!divRef.current || !window.Plotly) return;
    setActiveConvert(type.id);
    setShowConvert(false);
    const typeMap = {
      bar: "bar",
      line: "scatter",
      scatter: "scatter",
      pie: "pie",
      area: "scatter",
      histogram: "histogram",
    };
    const modeMap = { line: "lines", scatter: "markers", area: "lines" };
    (divRef.current.data || []).forEach((_, i) => {
      const u = { type: [typeMap[type.id]] };
      if (modeMap[type.id]) u.mode = [modeMap[type.id]];
      if (type.id === "area") u.fill = ["tozeroy"];
      window.Plotly.restyle(divRef.current, u, [i]);
    });
  };

  const download = async (fmt) => {
    if (!divRef.current || !window.Plotly) return;
    setDownloading(true);
    setShowExport(false);
    try {
      const title = message.content?.layout?.title?.text || "chart";
      await window.Plotly.downloadImage(divRef.current, {
        format: fmt.toLowerCase(),
        width: 1400,
        height: 800,
        filename: title.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const resetZoom = () => {
    if (!divRef.current || !window.Plotly) return;
    window.Plotly.relayout(divRef.current, {
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    });
  };

  const btn = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 10px",
    background: active ? "rgba(56,189,248,0.13)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${active ? "rgba(56,189,248,0.35)" : "rgba(255,255,255,0.07)"}`,
    borderRadius: "7px",
    color: active ? "#38bdf8" : "#64748b",
    fontSize: "0.72rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
    letterSpacing: "0.02em",
    flexShrink: 0,
  });

  const currentColors = (
    activePalette ? PALETTES.find((p) => p.id === activePalette) : PALETTES[0]
  )?.colors;

  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(90deg, rgba(8,14,26,0.97), rgba(10,18,32,0.97))",
        borderTop: "1px solid rgba(56,189,248,0.08)",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        overflowX: "auto",
        overflowY: "visible",
        scrollbarWidth: "none",
      }}
    >
      {/* ── Convert ─────────────────────────────────────────── */}
      <div ref={convertBtnRef} style={{ flexShrink: 0 }}>
        <Tip label="Convert chart type">
          <button
            style={btn(showConvert)}
            onClick={() => {
              closeAll();
              setShowConvert((v) => !v);
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>⇄</span>
            <span>Convert</span>
            {activeConvert && (
              <span
                style={{ color: "#38bdf8", fontSize: "0.65rem", opacity: 0.8 }}
              >
                •{activeConvert}
              </span>
            )}
          </button>
        </Tip>
        <PortalPopup anchorRef={convertBtnRef} open={showConvert}>
          <PopLabel>Switch Chart Type</PopLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "5px",
            }}
          >
            {CONVERT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => convertChart(type)}
                style={{
                  ...btn(activeConvert === type.id),
                  flexDirection: "column",
                  gap: "2px",
                  padding: "7px 4px",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </PortalPopup>
      </div>

      <Divider />

      {/* ── Colors ──────────────────────────────────────────── */}
      <div ref={paletteBtnRef} style={{ flexShrink: 0 }}>
        <Tip label="Change color palette">
          <button
            style={btn(showPalette)}
            onClick={() => {
              closeAll();
              setShowPalette((v) => !v);
            }}
          >
            <span style={{ display: "flex", gap: "2px", alignItems: "center" }}>
              {currentColors?.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: c,
                    display: "inline-block",
                  }}
                />
              ))}
            </span>
            <span>Colors</span>
          </button>
        </Tip>
        <PortalPopup anchorRef={paletteBtnRef} open={showPalette}>
          <PopLabel>Color Palette</PopLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => applyPalette(palette)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 8px",
                  background:
                    activePalette === palette.id
                      ? "rgba(56,189,248,0.1)"
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${activePalette === palette.id ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "7px",
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.12s",
                }}
              >
                <div style={{ display: "flex", gap: "3px" }}>
                  {palette.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        background: c,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: activePalette === palette.id ? "#38bdf8" : "#64748b",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {palette.label}
                </span>
                {activePalette === palette.id && (
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#38bdf8",
                      fontSize: "0.7rem",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </PortalPopup>
      </div>

      <Divider />

      {/* ── Grid ────────────────────────────────────────────── */}
      <Tip label={gridOn ? "Hide grid" : "Show grid"}>
        <button style={btn(gridOn)} onClick={toggleGrid}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>Grid</span>
        </button>
      </Tip>

      {/* ── Legend ──────────────────────────────────────────── */}
      <Tip label={legendOn ? "Hide legend" : "Show legend"}>
        <button style={btn(legendOn)} onClick={toggleLegend}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="9" y2="6" />
            <circle cx="6" cy="6" r="2" fill="currentColor" />
            <line x1="3" y1="12" x2="9" y2="12" />
            <circle cx="6" cy="12" r="2" fill="currentColor" />
            <line x1="3" y1="18" x2="9" y2="18" />
            <circle cx="6" cy="18" r="2" fill="currentColor" />
            <line x1="12" y1="6" x2="21" y2="6" />
            <line x1="12" y1="12" x2="21" y2="12" />
            <line x1="12" y1="18" x2="21" y2="18" />
          </svg>
          <span>Legend</span>
        </button>
      </Tip>

      {/* ── Labels ──────────────────────────────────────────── */}
      <Tip label={labelOn ? "Hide data labels" : "Show data labels"}>
        <button style={btn(labelOn)} onClick={toggleLabels}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span>Labels</span>
        </button>
      </Tip>

      {/* ── Background ──────────────────────────────────────── */}
      <Tip label={bgDark ? "Light background" : "Dark background"}>
        <button style={btn(!bgDark)} onClick={toggleBg}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>{bgDark ? "Light" : "Dark"}</span>
        </button>
      </Tip>

      <Divider />

      {/* ── Reset ───────────────────────────────────────────── */}
      <Tip label="Reset zoom & pan">
        <button style={btn(false)} onClick={resetZoom}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset</span>
        </button>
      </Tip>

      <Divider />

      {/* ── Export ──────────────────────────────────────────── */}
      <div ref={exportBtnRef} style={{ flexShrink: 0 }}>
        <Tip label="Export chart">
          <button
            style={btn(showExport)}
            onClick={() => {
              closeAll();
              setShowExport((v) => !v);
            }}
            disabled={downloading}
          >
            {downloading ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: "ctSpin 0.8s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            <span>{downloading ? "Exporting…" : "Export"}</span>
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </Tip>
        <PortalPopup anchorRef={exportBtnRef} open={showExport}>
          <PopLabel>Export As</PopLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {EXPORT_FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => download(fmt)}
                style={{
                  ...btn(false),
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "6px 10px",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {fmt}
              </button>
            ))}
          </div>
        </PortalPopup>
      </div>

      <style>{`@keyframes ctSpin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
