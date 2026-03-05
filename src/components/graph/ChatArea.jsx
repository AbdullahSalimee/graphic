"use client";
import { useEffect, useRef, useState } from "react";
import ChartToolbar from "./ChartToolbar";

const isMobile = () => window.innerWidth < 640;

function buildLayout(baseLayout) {
  const mobile = isMobile();
  return {
    ...baseLayout,
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: {
      color: "#94a3b8",
      size: mobile ? 10 : 12,
      family: "DM Sans, sans-serif",
    },
    legend: mobile
      ? {
          orientation: "h",
          x: 0,
          y: -0.28,
          font: { size: 10, color: "#94a3b8" },
          bgcolor: "rgba(0,0,0,0)",
        }
      : {
          ...(baseLayout.legend || {}),
          bgcolor: "rgba(7,13,26,0.85)",
          bordercolor: "rgba(56,189,248,0.15)",
          borderwidth: 1,
          font: { size: 12, color: "#94a3b8" },
        },
    margin: mobile
      ? { t: 40, l: 46, r: 10, b: 70 }
      : { t: 50, l: 55, r: 30, b: 50 },
    title: baseLayout.title
      ? {
          ...(typeof baseLayout.title === "string"
            ? { text: baseLayout.title }
            : baseLayout.title),
          font: {
            size: mobile ? 13 : 18,
            color: "#e2e8f0",
            family: "Playfair Display, serif",
          },
          x: 0.5,
          xanchor: "center",
        }
      : undefined,
    xaxis: {
      ...(baseLayout.xaxis || {}),
      tickangle: mobile ? -40 : 0,
      tickfont: { size: mobile ? 9 : 11, color: "#64748b" },
      gridcolor: "rgba(56,189,248,0.07)",
      linecolor: "rgba(56,189,248,0.12)",
      zerolinecolor: "rgba(56,189,248,0.12)",
      automargin: true,
    },
    yaxis: {
      ...(baseLayout.yaxis || {}),
      tickfont: { size: mobile ? 9 : 11, color: "#64748b" },
      gridcolor: "rgba(56,189,248,0.07)",
      linecolor: "rgba(56,189,248,0.12)",
      zerolinecolor: "rgba(56,189,248,0.12)",
      automargin: true,
    },
  };
}

export default function ChatArea({ messages }) {
  return (
    <div className="messages">
      {messages.map((msg, idx) => (
        <div
          key={msg.id}
          className="msg-row"
          style={{ animationDelay: `${idx * 0.03}s` }}
        >
          {msg.from === "user" ? (
            <div className="user-bubble">
              {msg.hasFile && (
                <div className="file-badge">
                  📎 {msg.fileName || "Attached file"}
                </div>
              )}
              {msg.content}
            </div>
          ) : (
            <div className="ai-block">
              <ChartBlock message={msg} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ChartBlock({ message }) {
  const divRef = useRef(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (message.status !== "success" || rendered.current || !divRef.current)
      return;

    const tryRender = () => {
      if (!window.Plotly) {
        setTimeout(tryRender, 100);
        return;
      }
      if (rendered.current || !divRef.current) return;
      rendered.current = true;

      try {
        const layout = buildLayout(message.content.layout || {});
        const mobile = isMobile();

        const data = (message.content.data || []).map((trace) => ({
          ...trace,
          ...(mobile && trace.type !== "pie" && trace.type !== "bar"
            ? {
                line: {
                  ...(trace.line || {}),
                  width: Math.min(trace.line?.width || 2, 1.5),
                },
                marker: {
                  ...(trace.marker || {}),
                  size: Math.min(trace.marker?.size || 8, 5),
                },
              }
            : {}),
        }));

        window.Plotly.newPlot(divRef.current, data, layout, {
          responsive: true,
          displayModeBar: false,
          scrollZoom: false,
        });
      } catch (e) {
        console.error("Plotly render error:", e);
      }
    };

    tryRender();
  }, [message.status]);

  // Reflow on orientation change / resize
  useEffect(() => {
    const onResize = () => {
      if (divRef.current && window.Plotly && rendered.current) {
        window.Plotly.relayout(
          divRef.current,
          buildLayout(message.content?.layout || {}),
        );
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [message.content]);

  if (message.status === "loading") {
    return (
      <div className="chart-loading">
        <div className="dots">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p>Generating visualization…</p>
      </div>
    );
  }

  if (message.status === "error") {
    return <div className="chart-error">⚠ {message.content}</div>;
  }

  const chartTitle =
    message.content?.layout?.title?.text ||
    (typeof message.content?.layout?.title === "string"
      ? message.content.layout.title
      : "Chart");

  return (
    <div className="chart-card">
      {/* ── Top bar: title only ───────────────────────────────── */}
      <div className="chart-card-toolbar">
        <span className="chart-card-title">{chartTitle}</span>
      </div>

      {/* ── Plotly canvas ─────────────────────────────────────── */}
      <div ref={divRef} className="chart-plot" />

      {/* ── Feature toolbar below canvas ──────────────────────── */}
      <ChartToolbar divRef={divRef} message={message} />
    </div>
  );
}
