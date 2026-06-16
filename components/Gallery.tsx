"use client";

import { useEffect, useRef, useState } from "react";

const items = [
  {
    id: "design",
    label: "Design",
    title: "An Exoskeleton Built to Last",
    cols: 2,
    rows: 2,
    visual: "design",
  },
  {
    id: "cockpit",
    label: "Cockpit",
    title: "Everything in view",
    cols: 1,
    rows: 1,
    visual: "cockpit",
  },
  {
    id: "charging",
    label: "Charging",
    title: "250kW Supercharging",
    cols: 1,
    rows: 1,
    visual: "charging",
  },
  {
    id: "offroad",
    label: "Off-Road",
    title: "Adjustable air suspension",
    cols: 2,
    rows: 1,
    visual: "offroad",
  },
];

const visuals: Record<string, React.ReactNode> = {
  design: (
    <svg viewBox="0 0 440 320" fill="none" className="w-full h-auto max-w-md mx-auto">
      {/* Large angular Cybertruck front-on perspective */}
      <polygon
        points="50,280 50,180 100,180 130,140 180,100 220,80 260,100 310,140 340,180 390,180 390,280"
        fill="rgba(18,21,28,0.95)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Roof */}
      <polygon points="130,140 180,100 220,80 260,100 310,140"
        fill="rgba(28,33,42,0.92)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Full-width light bar */}
      <rect x="50" y="180" width="340" height="6" rx="1" fill="rgba(255,255,255,0.85)" />
      <rect x="50" y="180" width="340" height="6" rx="1" fill="white" opacity="0.5"
        style={{ filter: "blur(5px)" }} />
      {/* Grille vents */}
      {[200, 215, 230, 245].map(y => (
        <line key={y} x1="100" y1={y} x2="340" y2={y}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      ))}
      {/* Wheels front-on */}
      <ellipse cx="130" cy="278" rx="52" ry="14" fill="rgba(10,12,18,0.98)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <ellipse cx="310" cy="278" rx="52" ry="14" fill="rgba(10,12,18,0.98)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* Glow */}
      <ellipse cx="220" cy="290" rx="200" ry="8" fill="rgba(62,106,225,0.08)" />
      <rect x="50" y="178" width="340" height="8" fill="rgba(62,106,225,0.25)"
        style={{ filter: "blur(10px)" }} />
    </svg>
  ),
  cockpit: (
    <svg viewBox="0 0 220 180" fill="none" className="w-full h-auto">
      {/* Steering wheel */}
      <circle cx="110" cy="130" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
      <circle cx="110" cy="130" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Spokes */}
      <line x1="110" y1="88" x2="110" y2="102" stroke="rgba(255,255,255,0.2)" strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="130" x2="82" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="6" strokeLinecap="round" />
      <line x1="152" y1="130" x2="138" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="6" strokeLinecap="round" />
      {/* Center hub */}
      <circle cx="110" cy="130" r="10" fill="rgba(62,106,225,0.3)" stroke="rgba(62,106,225,0.6)" strokeWidth="1" />
      {/* Display above */}
      <rect x="20" y="10" width="180" height="100" rx="4"
        fill="rgba(10,12,18,0.95)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Screen content lines */}
      <line x1="30" y1="30" x2="190" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <line x1="30" y1="50" x2="190" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <rect x="30" y="60" width="80" height="30" rx="2" fill="rgba(62,106,225,0.08)"
        stroke="rgba(62,106,225,0.2)" strokeWidth="0.5" />
      <text x="110" y="40" textAnchor="middle" fill="rgba(255,255,255,0.5)"
        style={{ fontFamily: "Manrope", fontSize: "9px", letterSpacing: "2px" }}>
        18.5 INCH DISPLAY
      </text>
    </svg>
  ),
  charging: (
    <svg viewBox="0 0 220 180" fill="none" className="w-full h-auto">
      {/* Charging arc */}
      <path d="M 30 130 A 80 80 0 0 1 190 130"
        stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M 30 130 A 80 80 0 0 1 155 60"
        stroke="var(--tesla-blue)" strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Bolt */}
      <path d="M 120 50 L 100 95 L 115 95 L 95 140 L 130 85 L 113 85 Z"
        fill="rgba(255,255,255,0.8)" />
      {/* KW label */}
      <text x="110" y="158" textAnchor="middle" fill="var(--subtle-gray)"
        style={{ fontFamily: "Manrope", fontWeight: 300, fontSize: "11px", letterSpacing: "3px" }}>
        250 kW
      </text>
    </svg>
  ),
  offroad: (
    <svg viewBox="0 0 440 200" fill="none" className="w-full h-auto">
      {/* Terrain / ground profile */}
      <path d="M 0 160 Q 60 120 100 140 Q 150 160 200 120 Q 250 80 300 100 Q 360 130 440 90"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      {/* Ground fill */}
      <path d="M 0 160 Q 60 120 100 140 Q 150 160 200 120 Q 250 80 300 100 Q 360 130 440 90 L 440 200 L 0 200 Z"
        fill="rgba(255,255,255,0.02)" />
      {/* Simplified Cybertruck at angle */}
      <g transform="translate(160,50) rotate(-8)">
        <polygon
          points="0,80 0,50 20,50 28,35 45,20 80,15 120,15 140,25 155,45 165,50 165,80"
          fill="rgba(18,21,28,0.95)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.2"
        />
        {/* Wheels */}
        <circle cx="32" cy="82" r="22" fill="rgba(10,12,18,0.98)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="133" cy="82" r="22" fill="rgba(10,12,18,0.98)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </g>
      {/* Suspension label */}
      <text x="220" y="190" textAnchor="middle" fill="var(--subtle-gray)"
        style={{ fontFamily: "Manrope", fontSize: "9px", letterSpacing: "3px" }}>
        ADAPTIVE AIR SUSPENSION · 17 IN CLEARANCE
      </text>
    </svg>
  ),
};

function GalleryCell({
  id,
  label,
  title,
  visual,
  delay,
}: Omit<(typeof items)[0], "cols" | "rows"> & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface-dark)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.2s ease`,
        borderColor: hovered ? "rgba(255,255,255,0.12)" : undefined,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "20px 24px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="tesla-label">{label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            opacity: hovered ? 0.6 : 0.25,
            transform: hovered ? "translate(2px,-2px)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <path
            d="M3 13L13 3M13 3H7M13 3v6"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Visual */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 24px",
        }}
      >
        {visuals[visual]}
      </div>

      {/* Title */}
      <div
        style={{
          padding: "0 24px 20px",
          fontFamily: "var(--font-display)",
          fontSize: "0.9375rem",
          fontWeight: 400,
          color: "var(--subtle-gray)",
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default function Gallery() {
  const headRef = useRef<HTMLDivElement>(null);
  const [headVisible, setHeadVisible] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeadVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="gallery"
      style={{
        background: "var(--bg-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        position: "relative",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={headRef}
          style={{
            marginBottom: "clamp(40px, 6vw, 64px)",
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "none" : "translateY(32px)",
            transition: "all 0.75s ease",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Explore</p>
          <h2 className="t-heading-lg" style={{ color: "var(--pure-white)" }}>
            Every Detail, Engineered
          </h2>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "360px 240px",
            gap: "12px",
          }}
        >
          <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
            <GalleryCell {...items[0]} delay={0} />
          </div>
          <div style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }}>
            <GalleryCell {...items[1]} delay={100} />
          </div>
          <div style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}>
            <GalleryCell {...items[2]} delay={200} />
          </div>
        </div>

        {/* Full-width cell */}
        <div style={{ marginTop: "12px", height: "200px" }}>
          <GalleryCell {...items[3]} delay={300} />
        </div>
      </div>
    </section>
  );
}
