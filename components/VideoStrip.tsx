"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_CDN = "https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto:best";
const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

export default function VideoStrip() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          videoRef.current?.play().catch(() => {});
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "clamp(360px, 55vw, 640px)",
        overflow: "hidden",
        background: "var(--bg-dark)",
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster={`${CDN}/Cybertruck-Second-Hero-Desktop.jpg`}
        onCanPlay={() => setReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 60%",
          opacity: ready ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      >
        <source src={`${VIDEO_CDN}/Cybertruck-Dopamine-On-Tap-Desktop.mp4`} type="video/mp4" />
      </video>

      {/* Poster fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${CDN}/Cybertruck-Second-Hero-Desktop.jpg`}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 60%",
          opacity: ready ? 0 : 1,
          transition: "opacity 1s ease",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(13,13,15,0.5) 0%, rgba(13,13,15,0.1) 40%, rgba(13,13,15,0.6) 100%)",
        }}
      />

      {/* Centered copy */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s",
        }}
      >
        <p className="tesla-label" style={{ marginBottom: "16px", color: "rgba(255,255,255,0.5)" }}>
          2.6 seconds · 0–60 mph
        </p>
        <h2
          className="t-heading-lg"
          style={{ color: "var(--pure-white)", maxWidth: "640px" }}
        >
          Nothing prepares you for it.
        </h2>
      </div>
    </section>
  );
}
