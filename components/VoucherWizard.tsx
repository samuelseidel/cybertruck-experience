"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// ─── Packages ────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: "discovery",
    name: "Discovery",
    duration: "30 min",
    price: "€149",
    desc: "The perfect first experience — or a gift for someone curious about the future.",
  },
  {
    id: "full",
    name: "Full Power",
    duration: "60 min",
    price: "€249",
    desc: "More time, more road. Highway stretches and full Cyberbeast capability.",
    featured: true,
  },
  {
    id: "elite",
    name: "Elite",
    duration: "120 min",
    price: "€499",
    desc: "A private two-hour session with a custom route — the ultimate gift.",
  },
];

// ─── Left panel ──────────────────────────────────────────────────────

const DISC = "https://digitalassets.tesla.com/discovery-tesla-com/image/upload/f_auto,q_auto";
const CT   = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

const LEFT_IMAGES = [
  { src: `${DISC}/Selector-Cybertruck-Desktop-No-Vehicle-Selector.png`, fallback: `${CT}/Cybertruck-Second-Hero-Desktop.jpg`,              pos: "center 40%" },
  { src: `${DISC}/Form-Cybertruck-Desktop-Modify-Appointment.png`,      fallback: `${CT}/Cybertruck-No-Paint-No-Chips-Desktop-STATIC.png`, pos: "center center" },
];

const LEFT_COPY = [
  "Give the experience.",
  "Personal touch.",
];

// ─── Form state ──────────────────────────────────────────────────────

export interface VoucherForm {
  pkg: string;
  isGift: boolean;
  recipientName: string;
  recipientEmail: string;
  giftMessage: string;
  senderName: string;
  senderLastName: string;
  senderEmail: string;
  phone: string;
}

// ─── Root ────────────────────────────────────────────────────────────

export default function VoucherWizard({ initialPkg }: { initialPkg?: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<VoucherForm>({
    pkg: initialPkg && PACKAGES.find(p => p.id === initialPkg) ? initialPkg : "",
    isGift: false,
    recipientName: "", recipientEmail: "", giftMessage: "",
    senderName: "", senderLastName: "", senderEmail: "", phone: "",
  });
  const rightRef = useRef<HTMLDivElement>(null);

  function goStep(n: number) {
    setStep(n);
    rightRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const selectedPkg = PACKAGES.find(p => p.id === form.pkg);

  return (
    <>
      <style>{`
        .vw-left { display: flex !important; }
        @media (max-width: 768px) { .vw-left { display: none !important; } }
      `}</style>

      <div style={{ display: "flex", height: "100svh", overflow: "hidden", background: "var(--bg-dark)" }}>

        {/* ── Left panel ── */}
        <div className="vw-left" style={{ flexShrink: 0, width: "42%", position: "relative", overflow: "hidden" }}>
          {LEFT_IMAGES.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img.src} alt="" aria-hidden
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = img.fallback; }}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: img.pos,
                opacity: step === i ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,13,15,0.45) 0%, rgba(13,13,15,0.05) 45%, rgba(13,13,15,0.75) 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>
              Step {step + 1} of 2
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 400, color: "rgba(255,255,255,0.92)", lineHeight: 1.35 }}>
              {LEFT_COPY[step]}
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div ref={rightRef} style={{ flex: 1, height: "100svh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Top nav */}
          <div style={{
            position: "sticky", top: 0, zIndex: 20, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 clamp(24px,5vw,64px)", height: "56px",
            background: "rgba(13,13,15,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <button
              onClick={() => step > 0 && goStep(step - 1)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "none", border: "none", cursor: step > 0 ? "pointer" : "default",
                fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 400,
                color: step > 0 ? "var(--subtle-gray)" : "transparent",
                transition: "color 0.2s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.16em", color: "var(--pure-white)" }}>
              CYBERTRUCK
            </span>
            <Link href="/" style={{ display: "flex", alignItems: "center", color: "var(--subtle-gray)", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>

          {/* Progress */}
          <div style={{ flexShrink: 0, display: "flex", gap: "4px", padding: "16px clamp(24px,5vw,64px) 0" }}>
            {[0, 1].map(i => (
              <div key={i} style={{
                flex: 1, height: "2px", borderRadius: "1px",
                background: i <= step ? "var(--tesla-blue)" : "rgba(255,255,255,0.1)",
                transition: "background 0.4s ease",
              }} />
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: "clamp(32px,5vw,56px) clamp(24px,5vw,64px)" }}>
            {step === 0 && <PackageStep form={form} setForm={setForm} onNext={() => goStep(1)} />}
            {step === 1 && selectedPkg && <DetailsStep form={form} setForm={setForm} pkg={selectedPkg} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Step 1: Package ─────────────────────────────────────────────────

function PackageStep({ form, setForm, onNext }: {
  form: VoucherForm; setForm: (f: VoucherForm) => void; onNext: () => void;
}) {
  return (
    <div>
      <p className="tesla-label" style={{ marginBottom: "12px" }}>Step 1 of 2</p>
      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "8px" }}>Choose an experience.</h1>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "36px", maxWidth: "420px" }}>
        Pick the session that fits the occasion. Every package includes full insurance, an instructor, and digital memories.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        {PACKAGES.map(pkg => {
          const sel = form.pkg === pkg.id;
          return (
            <button key={pkg.id} onClick={() => setForm({ ...form, pkg: pkg.id })} style={{
              display: "flex", alignItems: "center", gap: "16px", padding: "20px 22px",
              background: sel ? "rgba(62,106,225,0.09)" : "rgba(255,255,255,0.03)",
              border: sel ? "1px solid rgba(62,106,225,0.45)" : pkg.featured ? "1px solid rgba(62,106,225,0.18)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "var(--radius-card)", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s ease", position: "relative",
            }}>
              {pkg.featured && !sel && (
                <div style={{
                  position: "absolute", top: "-1px", right: "20px",
                  background: "rgba(62,106,225,0.75)", color: "white",
                  fontFamily: "var(--font-display)", fontSize: "0.5625rem", fontWeight: 700,
                  letterSpacing: "0.1em", padding: "3px 10px", borderRadius: "0 0 4px 4px",
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{
                flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%",
                border: sel ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                background: sel ? "var(--tesla-blue)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
              }}>
                {sel && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "var(--pure-white)" }}>{pkg.name}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{pkg.duration}</p>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{pkg.desc}</p>
              </div>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400,
                color: sel ? "var(--tesla-blue)" : "var(--pure-white)",
                flexShrink: 0, letterSpacing: "-0.01em", transition: "color 0.15s ease",
              }}>
                {pkg.price}
              </p>
            </button>
          );
        })}
      </div>

      <button onClick={onNext} disabled={!form.pkg} className="btn-tesla-accent"
        style={{ width: "100%", justifyContent: "center", height: "48px", opacity: form.pkg ? 1 : 0.4 }}>
        Continue
      </button>
      <p style={{ textAlign: "center", marginTop: "14px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
        Instant delivery · Valid 12 months · Fully refundable within 30 days
      </p>
    </div>
  );
}

// ─── Step 2: Details ─────────────────────────────────────────────────

function DetailsStep({ form, setForm, pkg }: {
  form: VoucherForm; setForm: (f: VoucherForm) => void; pkg: typeof PACKAGES[0];
}) {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg]   = useState("");

  const valid = form.isGift
    ? !!(form.recipientName && form.recipientEmail && form.senderName && form.senderEmail)
    : !!(form.senderName && form.senderLastName && form.senderEmail);

  async function handleSubmit() {
    if (!valid || loading) return;
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch {
      setErrMsg("Payment setup failed — please try again.");
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", height: "48px", padding: "0 16px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
    fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--pure-white)",
    outline: "none", transition: "border-color 0.15s ease, background 0.15s ease",
  };
  const lbl: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--subtle-gray)", marginBottom: "8px",
  };
  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
    e.currentTarget.style.background  = "rgba(255,255,255,0.07)";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
    e.currentTarget.style.background  = "rgba(255,255,255,0.05)";
  }

  return (
    <div>
      <p className="tesla-label" style={{ marginBottom: "12px" }}>Step 2 of 2</p>
      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "8px" }}>Your details.</h1>

      {/* Package summary */}
      <div style={{ padding: "14px 18px", background: "rgba(62,106,225,0.07)", border: "1px solid rgba(62,106,225,0.2)", borderRadius: "var(--radius-card)", marginBottom: "24px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(62,106,225,0.7)", marginBottom: "4px" }}>Selected</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--pure-white)" }}>
          {pkg.name} · {pkg.duration} · {pkg.price}
        </p>
      </div>

      {/* Gift toggle */}
      <button
        onClick={() => setForm({ ...form, isGift: !form.isGift })}
        style={{
          display: "flex", alignItems: "center", gap: "14px", width: "100%",
          padding: "18px 20px", marginBottom: "28px",
          background: form.isGift ? "rgba(62,106,225,0.08)" : "rgba(255,255,255,0.03)",
          border: form.isGift ? "1px solid rgba(62,106,225,0.35)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: "var(--radius-card)", cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
        }}
      >
        <div style={{
          flexShrink: 0, width: "22px", height: "22px", borderRadius: "4px",
          border: form.isGift ? "none" : "1.5px solid rgba(255,255,255,0.25)",
          background: form.isGift ? "var(--tesla-blue)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease",
        }}>
          {form.isGift && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "2px" }}>
            This is a gift
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>
            The voucher PDF will be sent to the recipient&apos;s email address
          </p>
        </div>
      </button>

      {/* ── Gift mode ── */}
      {form.isGift && (
        <>
          <p style={{ ...lbl, color: "rgba(62,106,225,0.75)", letterSpacing: "0.12em", marginBottom: "14px" }}>Recipient</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={lbl}>First Name</label>
              <input style={inp} type="text" required placeholder="Alex" value={form.recipientName}
                onChange={e => setForm({ ...form, recipientName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" required placeholder="alex@example.com" value={form.recipientEmail}
                onChange={e => setForm({ ...form, recipientEmail: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={lbl}>
              Gift Message
              <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0, marginLeft: "6px", opacity: 0.6 }}>optional</span>
            </label>
            <textarea
              placeholder="Add a personal note — we'll print it on the voucher."
              value={form.giftMessage}
              onChange={e => setForm({ ...form, giftMessage: e.target.value })}
              onFocus={onFocus} onBlur={onBlur}
              style={{ ...inp, height: "88px", padding: "12px 16px", resize: "none" } as React.CSSProperties}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 300, color: "var(--steel)" }}>from</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>
          <p style={{ ...lbl, marginBottom: "14px" }}>Your details</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
            <div>
              <label style={lbl}>Your Name</label>
              <input style={inp} type="text" required placeholder="Jane" value={form.senderName}
                onChange={e => setForm({ ...form, senderName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={lbl}>Your Email</label>
              <input style={inp} type="email" required placeholder="you@example.com" value={form.senderEmail}
                onChange={e => setForm({ ...form, senderEmail: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
        </>
      )}

      {/* ── Personal mode ── */}
      {!form.isGift && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={lbl}>First Name</label>
              <input style={inp} type="text" required placeholder="Jane" value={form.senderName}
                onChange={e => setForm({ ...form, senderName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={lbl}>Last Name</label>
              <input style={inp} type="text" required placeholder="Smith" value={form.senderLastName}
                onChange={e => setForm({ ...form, senderLastName: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>Email</label>
            <input style={inp} type="email" required placeholder="you@example.com" value={form.senderEmail}
              onChange={e => setForm({ ...form, senderEmail: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div style={{ marginBottom: "28px" }}>
            <label style={lbl}>
              Phone
              <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0, marginLeft: "6px", opacity: 0.6 }}>optional</span>
            </label>
            <input style={inp} type="tel" placeholder="+420 600 000 000" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
        </>
      )}

      {/* Error */}
      {errMsg && (
        <div style={{ padding: "10px 14px", marginBottom: "16px", background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.25)", borderRadius: "4px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(255,100,100,0.9)" }}>{errMsg}</p>
        </div>
      )}

      <button onClick={handleSubmit} disabled={!valid || loading} className="btn-tesla-accent"
        style={{ width: "100%", justifyContent: "center", height: "48px", opacity: valid && !loading ? 1 : 0.4, gap: "8px" }}>
        {loading ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "rwSpin 0.75s linear infinite" }}>
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <style>{`@keyframes rwSpin { to { transform: rotate(360deg); } }`}</style>
            Redirecting to payment…
          </>
        ) : (
          form.isGift ? "Send the Gift" : "Order Voucher"
        )}
      </button>

      <p style={{ textAlign: "center", marginTop: "14px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)", lineHeight: 1.5 }}>
        {form.isGift
          ? "Secure payment via Stripe · PDF voucher sent after checkout"
          : "Secure payment via Stripe · Voucher PDF in your inbox after checkout"
        }
      </p>
    </div>
  );
}
