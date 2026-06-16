"use client";

import { useEffect, useRef, useState } from "react";

const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    package: "full",
    date: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "4px",
    fontFamily: "var(--font-display)",
    fontSize: "0.9375rem",
    fontWeight: 300,
    color: "var(--pure-white)",
    outline: "none",
    transition: "border-color 0.15s ease, background 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-display)",
    fontSize: "0.6875rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--subtle-gray)",
    marginBottom: "8px",
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--onyx)",
      }}
    >
      {/* Background image — the confirmed Tesla hero image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${CDN}/CyberTruck_Hero_Desktop.jpg`}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(13,13,15,0.95) 0%, rgba(13,13,15,0.75) 100%)",
        }}
      />

      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(72px, 10vw, 120px) 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(48px, 6vw, 96px)",
          alignItems: "start",
        }}
      >
        {/* Left — copy */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-40px)",
            transition: "all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Reserve</p>
          <h2
            className="t-heading-lg"
            style={{ color: "var(--pure-white)", marginBottom: "20px" }}
          >
            Book Your Cybertruck Experience
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9375rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "440px",
            }}
          >
            Complete the form and our team will reach out within 24 hours to
            confirm your booking. A deposit of $49 holds your spot — fully
            refundable up to 48 hours before your session.
          </p>

          {/* Info list */}
          {[
            { icon: "📍", label: "Location", value: "Tesla Experience Center, Los Angeles" },
            { icon: "🕐", label: "Duration", value: "30, 60, or 120 minutes" },
            { icon: "🛡", label: "Insurance", value: "Full coverage included" },
            { icon: "📞", label: "Questions", value: "+1 (888) 518-3752" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "1rem", marginTop: "1px", flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--subtle-gray)",
                    marginBottom: "2px",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    color: "var(--pure-white)",
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right — form */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(40px)",
            transition: "all 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 120ms",
          }}
        >
          {submitted ? (
            <div
              style={{
                padding: "48px 32px",
                background: "rgba(62,106,225,0.08)",
                border: "1px solid rgba(62,106,225,0.25)",
                borderRadius: "var(--radius-card)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(62,106,225,0.15)",
                  border: "1px solid rgba(62,106,225,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="var(--tesla-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3
                className="t-heading"
                style={{ color: "var(--pure-white)", marginBottom: "12px" }}
              >
                Reservation Confirmed
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  color: "var(--subtle-gray)",
                  lineHeight: 1.6,
                }}
              >
                We&apos;ll reach out at <strong style={{ color: "var(--pure-white)" }}>{form.email}</strong> within 24 hours to confirm your Cybertruck experience.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "32px",
                background: "rgba(23,26,32,0.65)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Name row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input
                    style={inputStyle}
                    type="text"
                    required
                    placeholder="Elon"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input
                    style={inputStyle}
                    type="text"
                    required
                    placeholder="Musk"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  required
                  placeholder="elon@tesla.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Phone</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>

              {/* Package select */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Package</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                  value={form.package}
                  onChange={(e) => setForm({ ...form, package: e.target.value })}
                >
                  <option value="discovery">Discovery — 30 min · $149</option>
                  <option value="full">Full Power — 60 min · $249</option>
                  <option value="elite">Elite — 120 min · $499</option>
                </select>
              </div>

              {/* Date */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Preferred Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Message (optional)</label>
                <textarea
                  style={{
                    ...inputStyle,
                    height: "100px",
                    padding: "12px 16px",
                    resize: "none",
                  }}
                  placeholder="Any special requests or questions..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                />
              </div>

              <button type="submit" className="btn-tesla-accent" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
                Reserve My Spot
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "16px",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  color: "var(--steel)",
                  lineHeight: 1.5,
                }}
              >
                $49 refundable deposit · No credit card required to enquire
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
        select option {
          background: var(--onyx);
          color: var(--pure-white);
        }
      `}</style>
    </section>
  );
}
