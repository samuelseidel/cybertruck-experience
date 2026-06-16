"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "2.6s", label: "0–60 mph" },
  { value: "340mi", label: "Est. Range" },
  { value: "11k lbs", label: "Towing" },
  { value: "835hp", label: "Tri-Motor" },
];

function useReveal(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Performance() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      id="performance"
      style={{
        position: "relative",
        background: "var(--surface-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        overflow: "hidden",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headRef}
          className="ts-reveal"
          style={{ marginBottom: "clamp(48px, 6vw, 80px)", textAlign: "center", ...(headVisible && { opacity: 1, transform: "none" }) }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Performance</p>
          <h2
            className="t-heading-lg"
            style={{ color: "var(--pure-white)", marginBottom: "16px" }}
          >
            Insane. Ludicrous. Beast.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Three independent motors. All-wheel drive standard. Performance numbers
            that redefine what a truck can do.
          </p>
        </div>

        {/* Stats — Tesla uses a clean row, not a grid of cards */}
        <StatRow visible={headVisible} />

        {/* CTA */}
        <div
          style={{
            marginTop: "clamp(48px, 6vw, 72px)",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <a href="#book" className="btn-tesla-accent">
            Order Now
          </a>
          <a href="#experience" className="btn-tesla-secondary">
            Compare Models
          </a>
        </div>
      </div>

      <div className="tesla-divider" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
    </section>
  );
}

function StatRow({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1px",
        background: "var(--border-subtle)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
      }}
    >
      {stats.map((s, i) => (
        <StatCell key={s.label} {...s} delay={i * 80} visible={visible} />
      ))}
    </div>
  );
}

function StatCell({
  value,
  label,
  delay,
  visible,
}: {
  value: string;
  label: string;
  delay: number;
  visible: boolean;
}) {
  return (
    <div
      style={{
        padding: "clamp(32px, 4vw, 48px) 24px",
        background: "var(--surface-dark)",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div
        className="stat-num"
        style={{ marginBottom: "8px" }}
      >
        {value}
      </div>
      <p
        className="tesla-label"
        style={{ color: "var(--subtle-gray)" }}
      >
        {label}
      </p>
    </div>
  );
}
