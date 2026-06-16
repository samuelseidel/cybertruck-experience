"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  {
    id: "acceleration",
    label: "Acceleration",
    heading: "Feel 835 horses launch",
    body: "Before you're ready, 0–60 hits in 2.6 seconds. Pinned to your seat, the electric silence makes the speed feel surreal. The tri-motor powertrain delivers instant torque to all four wheels simultaneously.",
    align: "left" as const,
    bg: "var(--bg-dark)",
    visual: "accel",
  },
  {
    id: "interior",
    label: "Interior",
    heading: "18.5-inch cinematic display",
    body: "Every function lives in a single expansive display. Climate, navigation, entertainment, vehicle controls — exactly where you need them. Designed for the driver, not against them.",
    align: "right" as const,
    bg: "var(--surface-dark)",
    visual: "display",
  },
  {
    id: "exterior",
    label: "Exterior",
    heading: "Ultra-Hard stainless steel",
    body: "30X Cold-Rolled Stainless Steel that won't dent, won't rust, and won't need paint. An angular exoskeleton that isn't just distinctive — it's structurally superior.",
    align: "left" as const,
    bg: "var(--bg-dark)",
    visual: "exterior",
  },
  {
    id: "vault",
    label: "Vault",
    heading: "The bed, reimagined",
    body: "A 6-foot lockable cargo vault with a powered tonneau cover. On-board air compressor. Lockable frunk with 2.8 cubic feet. Power outlets at the bed and cab for any job.",
    align: "right" as const,
    bg: "var(--surface-dark)",
    visual: "vault",
  },
];

function Visualization({ type }: { type: string }) {
  const visuals: Record<string, React.ReactNode> = {
    accel: (
      <svg viewBox="0 0 320 220" fill="none" className="w-full h-auto">
        {/* Speedometer arc */}
        <path
          d="M 60 170 A 100 100 0 0 1 260 170"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 60 170 A 100 100 0 0 1 200 80"
          stroke="var(--tesla-blue)"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        {/* Needle */}
        <line x1="160" y1="170" x2="205" y2="82" stroke="var(--pure-white)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="160" cy="170" r="8" fill="rgba(62,106,225,0.3)" stroke="var(--tesla-blue)" strokeWidth="1.5" />
        {/* Text */}
        <text x="160" y="148" textAnchor="middle" fill="rgba(255,255,255,0.9)"
          style={{ fontFamily: "Manrope", fontWeight: 300, fontSize: "28px" }}>2.6s</text>
        <text x="160" y="164" textAnchor="middle" fill="var(--subtle-gray)"
          style={{ fontFamily: "Manrope", fontWeight: 400, fontSize: "10px", letterSpacing: "3px" }}>
          0–60 MPH
        </text>
        {/* Speed lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={i}
            x1={50 + i * 8} y1={120 - i * 6}
            x2={20 + i * 8} y2={110 - i * 6}
            stroke="rgba(62,106,225,0.3)" strokeWidth="1.5" strokeLinecap="round"
          />
        ))}
      </svg>
    ),
    display: (
      <svg viewBox="0 0 320 220" fill="none" className="w-full h-auto">
        {/* Monitor */}
        <rect x="40" y="20" width="240" height="155" rx="6" fill="rgba(18,21,28,0.9)"
          stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Screen content */}
        <rect x="50" y="30" width="220" height="135" rx="3" fill="rgba(10,12,18,0.95)" />
        {/* Map-like lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1={60} y1={50 + i * 22} x2={260} y2={50 + i * 22}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}
        {/* Route */}
        <path d="M 90 155 L 130 100 L 180 120 L 230 70" stroke="var(--tesla-blue)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="230" cy="70" r="5" fill="var(--tesla-blue)" opacity="0.8" />
        {/* Bottom bar */}
        <rect x="50" y="155" width="220" height="10" fill="rgba(62,106,225,0.08)" />
        <rect x="50" y="155" width="140" height="10" fill="rgba(62,106,225,0.15)" />
        {/* Stand */}
        <path d="M 150 175 L 170 175 L 175 195 L 145 195 Z"
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="135" y1="195" x2="185" y2="195" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      </svg>
    ),
    exterior: (
      <svg viewBox="0 0 320 220" fill="none" className="w-full h-auto">
        {/* Simplified Cybertruck profile — angular */}
        <polygon
          points="30,170 30,130 70,130 85,108 110,80 155,65 215,65 260,80 285,108 300,130 300,170"
          fill="rgba(18,21,28,0.95)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Roof */}
        <polygon points="110,80 155,65 215,65 260,80"
          fill="rgba(26,30,38,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        {/* Light bar */}
        <rect x="285" y="131" width="15" height="4" fill="rgba(255,255,255,0.9)" rx="1" />
        <rect x="285" y="131" width="15" height="4" fill="white" opacity="0.4"
          style={{ filter: "blur(4px)" }} rx="1" />
        {/* Wheels */}
        <circle cx="80" cy="170" r="28" fill="rgba(10,12,18,0.98)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="80" cy="170" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <circle cx="260" cy="170" r="28" fill="rgba(10,12,18,0.98)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="260" cy="170" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        {/* Ground */}
        <line x1="20" y1="198" x2="300" y2="198" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        {/* Steel texture lines */}
        <line x1="110" y1="80" x2="285" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <line x1="70" y1="130" x2="285" y2="130" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </svg>
    ),
    vault: (
      <svg viewBox="0 0 320 220" fill="none" className="w-full h-auto">
        {/* Bed outline — 3D perspective */}
        <path d="M 40 70 L 280 70 L 300 90 L 300 180 L 40 180 Z"
          fill="rgba(18,21,28,0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Tonneau cover — partially open */}
        <path d="M 40 70 L 280 70 L 280 50 L 40 50 Z"
          fill="rgba(26,30,38,0.95)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* Hinge */}
        <line x1="40" y1="50" x2="40" y2="70" stroke="rgba(62,106,225,0.6)" strokeWidth="2" />
        {/* Cargo suggestions */}
        <rect x="70" y="110" width="60" height="50" rx="3"
          fill="rgba(62,106,225,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <rect x="160" y="100" width="100" height="60" rx="3"
          fill="rgba(62,106,225,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        {/* Dimension label */}
        <line x1="40" y1="195" x2="280" y2="195" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="3 4" />
        <text x="160" y="212" textAnchor="middle" fill="var(--subtle-gray)"
          style={{ fontFamily: "Manrope", fontSize: "9px", letterSpacing: "3px" }}>
          6 FEET · 100 CU FT
        </text>
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "32px",
        background: "rgba(26,30,38,0.5)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-card)",
      }}
    >
      {visuals[type]}
    </div>
  );
}

function ExperienceSection({
  id,
  label,
  heading,
  body,
  align,
  bg,
  visual,
  index,
}: (typeof sections)[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const textFirst = align === "left";

  return (
    <section
      id={id}
      ref={ref}
      style={{
        background: bg,
        padding: "clamp(72px, 10vw, 120px) 24px",
        position: "relative",
      }}
    >
      <div
        className="tesla-divider"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      />

      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "clamp(40px, 6vw, 80px)",
          flexWrap: "wrap",
        }}
      >
        {/* Text block */}
        <div
          style={{
            flex: "1 1 320px",
            order: textFirst ? 0 : 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : `translateX(${textFirst ? "-40px" : "40px"})`,
            transition: "all 0.75s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>
            {label}
          </p>
          <h2
            className="t-heading-lg"
            style={{ color: "var(--pure-white)", marginBottom: "20px" }}
          >
            {heading}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9375rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
              lineHeight: 1.65,
              maxWidth: "480px",
              marginBottom: "32px",
            }}
          >
            {body}
          </p>
          <a href="#book" className="btn-tesla-accent">
            Learn More
          </a>
        </div>

        {/* Visual */}
        <div
          style={{
            flex: "1 1 320px",
            display: "flex",
            justifyContent: textFirst ? "flex-end" : "flex-start",
            order: textFirst ? 1 : 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : `translateX(${textFirst ? "40px" : "-40px"})`,
            transition: "all 0.75s cubic-bezier(0.25,0.46,0.45,0.94) 120ms",
          }}
        >
          <Visualization type={visual} />
        </div>
      </div>
    </section>
  );
}

export default function Experience() {
  return (
    <div id="experience">
      {sections.map((s, i) => (
        <ExperienceSection key={s.id} {...s} index={i} />
      ))}
    </div>
  );
}
