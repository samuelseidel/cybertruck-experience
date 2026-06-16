"use client";

import { useEffect, useRef, useState } from "react";

const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [slotInfo, setSlotInfo] = useState<{ city: string; address: string; date: string; time: string } | null>(null);
  const [isVoucher, setIsVoucher] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    package: "discovery",
    date: "",
    giftMessage: "",
  });

  useEffect(() => {
    const slotRaw = sessionStorage.getItem("selectedSlot");
    if (slotRaw) {
      try { setSlotInfo(JSON.parse(slotRaw)); } catch {}
      sessionStorage.removeItem("selectedSlot");
    }
    const voucherPkg = sessionStorage.getItem("voucherPkg");
    if (voucherPkg) {
      setIsVoucher(true);
      setForm((f) => ({ ...f, package: voucherPkg }));
      sessionStorage.removeItem("voucherPkg");
    }
    const pkg = sessionStorage.getItem("selectedPkg");
    if (pkg) { setForm((f) => ({ ...f, package: pkg })); sessionStorage.removeItem("selectedPkg"); }
  }, []);

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
        src={`${CDN}/Cybertruck-Main-Hero-Desktop.jpg`}
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
          <p className="tesla-label" style={{ marginBottom: "16px" }}>
            {isVoucher ? "Voucher" : slotInfo ? "Your Booking" : "Book"}
          </p>
          <h2
            className="t-heading-lg"
            style={{ color: "var(--pure-white)", marginBottom: "20px" }}
          >
            {isVoucher
              ? "Order Your Voucher"
              : slotInfo
              ? "Complete Your Booking"
              : "Book Your Cybertruck Experience"}
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
            {isVoucher
              ? "Fill in your details and we'll send your gift voucher by email within minutes. Valid at any tour location for 12 months."
              : slotInfo
              ? "Your slot is reserved for 10 minutes. Fill in your details and we'll confirm the booking instantly."
              : "Complete the form and our team will reach out within 24 hours to confirm your booking. A €49 deposit holds your spot — fully refundable up to 48 hours before your session."}
          </p>

          {/* Info list */}
          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.35)"/>
                </svg>
              ),
              label: "Location",
              value: "Cybertruck Experience Center, Los Angeles",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
                  <path d="M8 5v3.5l2 1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Duration",
              value: "30, 60, or 120 minutes",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L2 4v4c0 3.3 2.5 5.8 6 6.5 3.5-.7 6-3.2 6-6.5V4L8 1.5z" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M5.5 8l1.5 1.5 3.5-3" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Insurance",
              value: "Full coverage included",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3h2l1.5 3.5-1.5 1S6 10 9 11.5l1-1.5L13.5 11v2c-6 1-11-7-10.5-10z" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              ),
              label: "Questions",
              value: "+1 (888) 518-3752",
            },
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
              <span style={{ marginTop: "2px", flexShrink: 0 }}>
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
                {isVoucher ? "Voucher on its way" : "Slot Reserved"}
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
                {isVoucher
                  ? <>Your voucher will arrive at <strong style={{ color: "var(--pure-white)" }}>{form.email}</strong> within a few minutes.</>
                  : <>We&apos;ll confirm your booking at <strong style={{ color: "var(--pure-white)" }}>{form.email}</strong> within the hour{slotInfo ? ` — ${slotInfo.city}, ${slotInfo.date} at ${slotInfo.time}` : ""}.</>
                }
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
              {/* Slot summary banner */}
              {slotInfo && (
                <div style={{
                  padding: "14px 16px",
                  background: "rgba(62,106,225,0.08)",
                  border: "1px solid rgba(62,106,225,0.25)",
                  borderRadius: "4px",
                  marginBottom: "24px",
                }}>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(62,106,225,0.7)",
                    marginBottom: "4px",
                  }}>
                    Selected slot
                  </p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: "var(--pure-white)",
                    marginBottom: "2px",
                  }}>
                    {slotInfo.city} · {slotInfo.date} · {slotInfo.time}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.8125rem",
                    fontWeight: 300,
                    color: "var(--subtle-gray)",
                  }}>
                    {slotInfo.address}
                  </p>
                </div>
              )}
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
                    placeholder="Jane"
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
                    placeholder="Smith"
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
                  placeholder="you@example.com"
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

              {/* Date — hidden when slot pre-selected */}
              {!slotInfo && !isVoucher && (
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
              )}

              {/* Gift message — voucher mode only */}
              {isVoucher && (
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Gift Message (optional)</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      height: "88px",
                      padding: "12px 16px",
                      resize: "none",
                    }}
                    placeholder="Add a personal note — we'll include it on the voucher."
                    value={form.giftMessage}
                    onChange={(e) => setForm({ ...form, giftMessage: e.target.value })}
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
              )}

              <button
                type="submit"
                className="btn-tesla-accent"
                style={{ width: "100%", justifyContent: "center", height: "48px", marginTop: slotInfo || isVoucher ? "8px" : "0" }}
              >
                {isVoucher ? "Order Voucher" : "Reserve My Slot"}
              </button>

              <p style={{
                textAlign: "center",
                marginTop: "16px",
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                fontWeight: 300,
                color: "var(--steel)",
                lineHeight: 1.5,
              }}>
                {isVoucher
                  ? "Delivered by email within minutes · Valid 12 months at any location"
                  : "€49 refundable deposit · Confirmation within the hour"}
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
