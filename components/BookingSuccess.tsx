"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PKG_LABELS: Record<string, { name: string; duration: string; price: string }> = {
  discovery: { name: "Discovery",  duration: "30 min",  price: "€149" },
  full:      { name: "Full Power", duration: "60 min",  price: "€249" },
  elite:     { name: "Elite",      duration: "120 min", price: "€499" },
};

type Phase = "loading" | "done" | "error";

interface BookingData {
  ref: string;
  pkg: string;
  city: string;
  address: string;
  dateLabel: string;
  time: string;
  firstName: string;
  email: string;
}

export default function BookingSuccess({ sessionId }: { sessionId?: string }) {
  const [phase, setPhase]     = useState<Phase>("loading");
  const [data, setData]       = useState<BookingData | null>(null);
  const [errMsg, setErrMsg]   = useState("");

  useEffect(() => {
    if (!sessionId) { setPhase("error"); setErrMsg("No session ID found."); return; }
    fetchBooking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/booking/session?session_id=${sessionId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setPhase("done");
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : "Failed to load booking.");
      setPhase("error");
    }
  }

  const pkg = data ? (PKG_LABELS[data.pkg] || PKG_LABELS.discovery) : null;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100svh", background: "var(--bg-dark)", padding: "24px",
    }}>
      {/* Wordmark bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.16em", color: "var(--pure-white)" }}>CYBERTRUCK</span>
      </div>

      <div style={{ textAlign: "center", maxWidth: "480px", width: "100%", paddingTop: "56px" }}>

        {/* Icon */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 32px",
          background: phase === "error" ? "rgba(220,50,50,0.1)" : "rgba(62,106,225,0.12)",
          border: `1px solid ${phase === "error" ? "rgba(220,50,50,0.3)" : "rgba(62,106,225,0.35)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {phase === "loading" && (
            <>
              <style>{`@keyframes bsSpin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid rgba(62,106,225,0.2)", borderTopColor: "var(--tesla-blue)", animation: "bsSpin 0.75s linear infinite" }} />
            </>
          )}
          {phase === "done" && (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16l6 6 10-10" stroke="var(--tesla-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {phase === "error" && (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 10v8M16 22v1" stroke="rgba(220,80,80,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {phase === "loading" && (
          <>
            <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "12px" }}>Confirming your booking…</h1>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65 }}>
              Hold on while we verify your payment.
            </p>
          </>
        )}

        {phase === "done" && data && pkg && (
          <>
            <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "8px" }}>
              You&apos;re booked, {data.firstName}.
            </h1>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "32px" }}>
              Confirmation sent to <strong style={{ color: "var(--pure-white)" }}>{data.email}</strong>.
            </p>

            {/* Booking card */}
            <div style={{ padding: "20px 24px", background: "var(--surface-dark)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-card)", textAlign: "left", marginBottom: "28px" }}>
              {/* Booking ref */}
              <div style={{ padding: "0 0 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--subtle-gray)" }}>Booking Ref</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.9375rem", fontWeight: 600, color: "var(--tesla-blue)", letterSpacing: "0.08em" }}>{data.ref}</span>
              </div>

              {[
                { label: "Experience", value: `${pkg.name} · ${pkg.duration}` },
                { label: "City",       value: data.city },
                { label: "Location",   value: data.address },
                { label: "Date",       value: data.dateLabel },
                { label: "Time",       value: data.time },
                { label: "Paid",       value: pkg.price },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 400, color: "var(--pure-white)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>

            <Link href="/" className="btn-tesla-secondary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
              Back to Home
            </Link>
            <p style={{ marginTop: "20px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
              Need to reschedule? Email hello@cybertruck.experience with your booking ref.
            </p>
          </>
        )}

        {phase === "error" && (
          <>
            <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "12px" }}>Something went wrong.</h1>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "32px" }}>
              {errMsg || "We couldn't confirm your booking."} Your payment was processed — please contact us and we'll sort it out.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button onClick={fetchBooking} className="btn-tesla-accent" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
                Try Again
              </button>
              <Link href="/" className="btn-tesla-secondary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
                Back to Home
              </Link>
            </div>
            <p style={{ marginTop: "20px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
              Questions? Email hello@cybertruck.experience
            </p>
          </>
        )}
      </div>
    </div>
  );
}
