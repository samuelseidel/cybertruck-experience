"use client";

import { useEffect, useRef, useState } from "react";

const vouchers = [
  {
    id: "discovery",
    name: "Discovery",
    duration: "30 min",
    price: "€149",
    desc: "The perfect first experience — or a gift for someone curious about the future.",
    features: [
      "30-minute solo drive",
      "City route with instructor",
      "Full acceleration run",
      "Digital photo package",
    ],
  },
  {
    id: "full",
    name: "Full Power",
    duration: "60 min",
    price: "€249",
    desc: "More time, more road. Highway stretches and full Cyberbeast capability.",
    features: [
      "60-minute solo drive",
      "Highway + city route",
      "Full performance demo",
      "Professional photo set",
      "Cybertruck keepsake",
    ],
    featured: true,
  },
  {
    id: "elite",
    name: "Elite",
    duration: "120 min",
    price: "€499",
    desc: "A private two-hour session with a custom route — the ultimate gift.",
    features: [
      "120-minute private session",
      "Custom route selection",
      "Pro photo + video package",
      "Merchandise kit",
      "Dedicated host",
    ],
  },
];

export default function Vouchers() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function buyVoucher(id: string) {
    sessionStorage.setItem("voucherPkg", id);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="vouchers"
      ref={ref}
      style={{
        background: "var(--surface-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        position: "relative",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(48px, 6vw, 72px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition: "all 0.75s ease",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Gift Vouchers</p>
          <h2 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "16px" }}>
            Give the experience.
          </h2>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 300,
            color: "var(--subtle-gray)",
            maxWidth: "420px",
            margin: "0 auto",
            lineHeight: 1.65,
          }}>
            Sent instantly by email. Redeemable at any tour location. Valid for 12 months.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "stretch",
        }}>
          {vouchers.map((v, i) => (
            <VoucherCard
              key={v.id}
              voucher={v}
              delay={i * 100}
              visible={visible}
              onBuy={() => buyVoucher(v.id)}
            />
          ))}
        </div>

        {/* Trust line */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap",
          marginTop: "40px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.75s ease 0.4s",
        }}>
          {[
            { label: "Instant delivery", sub: "to any email address" },
            { label: "12-month validity", sub: "book any available date" },
            { label: "Fully refundable", sub: "within 30 days of purchase" },
          ].map(({ label, sub }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--pure-white)",
                marginBottom: "4px",
              }}>{label}</p>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                fontWeight: 300,
                color: "var(--steel)",
              }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VoucherCard({
  voucher, delay, visible, onBuy,
}: {
  voucher: typeof vouchers[0];
  delay: number;
  visible: boolean;
  onBuy: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const featured = "featured" in voucher && voucher.featured;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 280px",
        display: "flex",
        flexDirection: "column",
        padding: "32px",
        background: featured
          ? "rgba(62,106,225,0.08)"
          : hovered
          ? "rgba(26,30,38,0.8)"
          : "var(--bg-dark)",
        border: featured
          ? "1px solid rgba(62,106,225,0.35)"
          : `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-card)",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, background 0.2s ease, border-color 0.2s ease`,
      }}
    >
      {featured && (
        <div style={{
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
        }}>
          Most Popular
        </div>
      )}

      <p className="tesla-label" style={{
        marginBottom: "12px",
        marginTop: featured ? "12px" : 0,
        color: featured ? "rgba(62,106,225,0.8)" : "var(--subtle-gray)",
      }}>
        {voucher.duration}
      </p>

      <h3 className="t-heading" style={{ color: "var(--pure-white)", marginBottom: "4px" }}>
        {voucher.name}
      </h3>

      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: "2.25rem",
        fontWeight: 300,
        color: featured ? "var(--tesla-blue)" : "var(--pure-white)",
        letterSpacing: "-0.02em",
        marginBottom: "8px",
      }}>
        {voucher.price}
      </p>

      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: "0.875rem",
        fontWeight: 300,
        color: "var(--subtle-gray)",
        lineHeight: 1.5,
        marginBottom: "24px",
      }}>
        {voucher.desc}
      </p>

      <div className="tesla-divider" style={{ marginBottom: "24px" }} />

      <ul style={{ flex: 1, marginBottom: "28px", listStyle: "none" }}>
        {voucher.features.map((f) => (
          <li key={f} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontFamily: "var(--font-display)",
            fontSize: "0.875rem",
            fontWeight: 300,
            color: "var(--subtle-gray)",
            marginBottom: "10px",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: "2px", flexShrink: 0 }}>
              <circle
                cx="7" cy="7" r="6"
                fill={featured ? "rgba(62,106,225,0.15)" : "rgba(255,255,255,0.05)"}
                stroke={featured ? "rgba(62,106,225,0.4)" : "rgba(255,255,255,0.1)"}
                strokeWidth="0.8"
              />
              <path
                d="M4 7l2 2 4-4"
                stroke={featured ? "rgba(62,106,225,0.9)" : "rgba(255,255,255,0.5)"}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onBuy}
        className={featured ? "btn-tesla-accent" : "btn-tesla-secondary"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        Buy Voucher
      </button>
    </div>
  );
}
