"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const CITIES = [
  { city: "Prague",          address: "Experience Hub, Letňany",    flag: "CZ" },
  { city: "Brno",            address: "BVV Exhibition Centre",       flag: "CZ" },
  { city: "Hradec Králové",  address: "Aupark Hradec Králové",       flag: "CZ" },
  { city: "Ostrava",         address: "Forum Nová Karolina",         flag: "CZ" },
];

export default function Schedule() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="schedule"
      ref={ref}
      style={{
        background: "var(--bg-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        position: "relative",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "clamp(40px, 6vw, 64px)",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(32px)",
          transition: "all 0.75s ease",
        }}>
          <div>
            <p className="tesla-label" style={{ marginBottom: "16px" }}>Tour Locations</p>
            <h2 className="t-heading-lg" style={{ color: "var(--pure-white)" }}>
              Where we&apos;ll be.
            </h2>
          </div>
          <Link href="/reserve" className="btn-tesla-secondary">
            Book a Ride
          </Link>
        </div>

        {/* City list */}
        <div style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.75s ease 0.1s",
        }}>
          {CITIES.map((c, i) => (
            <div
              key={c.city}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 0",
                borderBottom: i < CITIES.length - 1 ? "1px solid var(--border-subtle)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Index */}
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "var(--steel)",
                  width: "20px",
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Pin icon */}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                  <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="var(--pure-white)" />
                </svg>

                <div>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                    fontWeight: 400,
                    color: "var(--pure-white)",
                    marginBottom: "2px",
                    letterSpacing: "-0.01em",
                  }}>
                    {c.city}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.8125rem",
                    fontWeight: 300,
                    color: "var(--subtle-gray)",
                  }}>
                    {c.address}
                  </p>
                </div>
              </div>

              <Link
                href="/reserve"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8125rem",
                  fontWeight: 400,
                  color: "var(--tesla-blue)",
                  textDecoration: "none",
                  flexShrink: 0,
                  opacity: 0.85,
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}
              >
                Book here →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
