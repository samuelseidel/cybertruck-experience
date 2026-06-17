"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Phase = "loading" | "downloading" | "done" | "error";

export default function VoucherSuccess() {
  const searchParams = useSearchParams();
  const sessionId    = searchParams.get("session_id");
  const [phase, setPhase]   = useState<Phase>("loading");
  const [errMsg, setErrMsg] = useState("");
  const [fileName, setFileName] = useState("cybertruck-voucher.pdf");

  useEffect(() => {
    if (!sessionId) { setPhase("error"); setErrMsg("No session ID found."); return; }
    downloadPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function downloadPdf() {
    setPhase("downloading");
    try {
      const res = await fetch(`/api/voucher/pdf?session_id=${sessionId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const cd   = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const name  = match?.[1] || "cybertruck-voucher.pdf";
      setFileName(name);

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setPhase("done");
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : "Download failed.");
      setPhase("error");
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100svh", background: "var(--bg-dark)", padding: "24px",
    }}>
      {/* Wordmark */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.16em", color: "var(--pure-white)" }}>CYBERTRUCK</span>
      </div>

      <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>

        {/* Icon */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%", margin: "0 auto 32px",
          background: phase === "error" ? "rgba(220,50,50,0.1)" : "rgba(62,106,225,0.12)",
          border: `1px solid ${phase === "error" ? "rgba(220,50,50,0.3)" : "rgba(62,106,225,0.35)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {(phase === "loading" || phase === "downloading") && (
            <>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid rgba(62,106,225,0.2)", borderTopColor: "var(--tesla-blue)", animation: "spin 0.75s linear infinite" }} />
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

        {/* Heading */}
        <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "12px" }}>
          {phase === "loading"     && "Processing payment…"}
          {phase === "downloading" && "Generating your voucher…"}
          {phase === "done"        && "Voucher downloaded."}
          {phase === "error"       && "Something went wrong."}
        </h1>

        {/* Body */}
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "36px" }}>
          {(phase === "loading" || phase === "downloading") && "Hang on — we're building your voucher PDF with a personal QR code."}
          {phase === "done" && (
            <>
              Your voucher PDF (<strong style={{ color: "var(--pure-white)" }}>{fileName}</strong>) has been saved to your downloads.
              Check your inbox — a copy was also sent to your email.
            </>
          )}
          {phase === "error" && (
            <>
              {errMsg || "We couldn't generate your voucher."} Your payment was still processed — please contact us and we'll send it manually.
            </>
          )}
        </p>

        {/* Actions */}
        {phase === "done" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={downloadPdf} className="btn-tesla-secondary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
              Download Again
            </button>
            <Link href="/" className="btn-tesla-accent" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
              Back to Home
            </Link>
          </div>
        )}

        {phase === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={downloadPdf} className="btn-tesla-accent" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
              Try Again
            </button>
            <Link href="/" className="btn-tesla-secondary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
              Back to Home
            </Link>
          </div>
        )}

        {/* Trust note */}
        {(phase === "done" || phase === "error") && (
          <p style={{ marginTop: "24px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
            Questions? Email us at hello@cybertruck.experience
          </p>
        )}
      </div>
    </div>
  );
}
