"use client";

import { useEffect, useRef, useState } from "react";

const packages = [
  {
    id: "discovery",
    name: "Discovery",
    duration: "30 min",
    price: "$149",
    desc: "Your first time behind the wheel of the future.",
    features: [
      "Guided co-pilot session",
      "City route experience",
      "Performance demonstration",
      "Digital memory package",
    ],
    cta: "Select",
    accent: false,
  },
  {
    id: "full",
    name: "Full Power",
    duration: "60 min",
    price: "$249",
    desc: "Solo drive. Full capabilities. Nothing held back.",
    features: [
      "Solo driver experience",
      "Highway + city combined route",
      "Full acceleration runs",
      "Vault & off-road demo",
      "Professional photo set",
      "Cybertruck keepsake",
    ],
    cta: "Book Now",
    accent: true,
  },
  {
    id: "elite",
    name: "Elite",
    duration: "120 min",
    price: "$499",
    desc: "A private, curated experience with no compromises.",
    features: [
      "Private VIP session",
      "Custom route selection",
      "Off-road course access",
      "Pro photo + video package",
      "Merchandise kit",
      "Dedicated host",
    ],
    cta: "Select",
    accent: false,
  },
];

function PackageCard({
  pkg,
  delay,
  visible,
}: {
  pkg: (typeof packages)[0];
  delay: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 280px",
        display: "flex",
        flexDirection: "column",
        padding: "32px",
        background: pkg.accent
          ? "rgba(62,106,225,0.08)"
          : hovered
          ? "rgba(26,30,38,0.8)"
          : "var(--surface-dark)",
        border: pkg.accent
          ? "1px solid rgba(62,106,225,0.35)"
          : `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-card)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, background 0.2s ease, border-color 0.2s ease`,
        position: "relative",
      }}
    >
      {pkg.accent && (
        <div
          style={{
            position: "absolute",
            top: "-1px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--tesla-blue)",
            color: "var(--pure-white)",
            fontFamily: "var(--font-display)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            padding: "4px 16px",
            borderRadius: "0 0 4px 4px",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}

      {/* Duration label */}
      <p
        className="tesla-label"
        style={{
          marginBottom: "12px",
          marginTop: pkg.accent ? "12px" : 0,
          color: pkg.accent ? "rgba(62,106,225,0.8)" : "var(--subtle-gray)",
        }}
      >
        {pkg.duration}
      </p>

      {/* Name */}
      <h3
        className="t-heading"
        style={{
          color: "var(--pure-white)",
          marginBottom: "4px",
        }}
      >
        {pkg.name}
      </h3>

      {/* Price */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.25rem",
          fontWeight: 300,
          color: pkg.accent ? "var(--tesla-blue)" : "var(--pure-white)",
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}
      >
        {pkg.price}
      </p>

      {/* Desc */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.875rem",
          fontWeight: 300,
          color: "var(--subtle-gray)",
          lineHeight: 1.5,
          marginBottom: "24px",
        }}
      >
        {pkg.desc}
      </p>

      {/* Divider */}
      <div
        className="tesla-divider"
        style={{ marginBottom: "24px" }}
      />

      {/* Features */}
      <ul style={{ flex: 1, marginBottom: "28px", listStyle: "none" }}>
        {pkg.features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontFamily: "var(--font-display)",
              fontSize: "0.875rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
              marginBottom: "10px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ marginTop: "2px", flexShrink: 0 }}
            >
              <circle cx="7" cy="7" r="6"
                fill={pkg.accent ? "rgba(62,106,225,0.15)" : "rgba(255,255,255,0.05)"}
                stroke={pkg.accent ? "rgba(62,106,225,0.4)" : "rgba(255,255,255,0.1)"}
                strokeWidth="0.8"
              />
              <path
                d="M4 7l2 2 4-4"
                stroke={pkg.accent ? "rgba(62,106,225,0.9)" : "rgba(255,255,255,0.5)"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        className={pkg.accent ? "btn-tesla-accent" : "btn-tesla-secondary"}
        style={{ textAlign: "center", justifyContent: "center" }}
      >
        {pkg.cta}
      </a>
    </div>
  );
}

export default function Booking() {
  const headRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="book"
      style={{
        background: "var(--surface-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        position: "relative",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      {/* Subtle glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(62,106,225,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1320px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          ref={headRef}
          style={{
            textAlign: "center",
            marginBottom: "clamp(48px, 6vw, 72px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition: "all 0.75s ease",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Book a Ride</p>
          <h2
            className="t-heading-lg"
            style={{ color: "var(--pure-white)", marginBottom: "16px" }}
          >
            Choose Your Experience
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9375rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Every package includes professional guidance, full vehicle access,
            and the chance to feel what electric really means.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          {packages.map((pkg, i) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              delay={i * 100}
              visible={visible}
            />
          ))}
        </div>

        {/* Footnote */}
        <p
          style={{
            textAlign: "center",
            marginTop: "32px",
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            color: "var(--steel)",
            fontWeight: 300,
          }}
        >
          All experiences include insurance coverage and safety briefing.
          Valid driver&apos;s license required. Minimum age 21.
        </p>
      </div>
    </section>
  );
}
