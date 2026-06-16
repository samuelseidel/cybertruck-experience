"use client";

import { useEffect, useRef, useState } from "react";

const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";
const VIDEO_CDN = "https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto:best";
const HERO_VIDEO_MP4 = `${VIDEO_CDN}/Cybertruck-Built-For-Any-Planet-Desktop.mp4`;
const HERO_VIDEO_WEBM = `${CDN}/Cybertruck_Hero_Desktop.webm`;
const HERO_POSTER = `${CDN}/Cybertruck-Built-For-Any-Planet-Desktop-Poster.jpg`;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady);
    v.load();
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-dark)",
      }}
    >
      {/* Tesla CDN Video — autoplay muted loop (exact Tesla pattern) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={HERO_POSTER}
        onCanPlay={() => setVideoReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          opacity: videoReady ? 1 : 0,
          transition: "opacity 1.4s ease",
          zIndex: 0,
        }}
      >
        <source src={HERO_VIDEO_WEBM} type="video/webm" />
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
      </video>

      {/* Poster image — visible while video loads */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_POSTER}
        alt=""
        aria-hidden
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          opacity: videoReady ? 0 : loaded ? 1 : 0,
          transition: "opacity 1s ease",
          zIndex: 0,
        }}
      />

      {/* Dark cinematic overlays — same layering Tesla uses */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(13,13,15,0.35) 0%, rgba(13,13,15,0.05) 35%, rgba(13,13,15,0.05) 55%, rgba(13,13,15,0.75) 82%, var(--bg-dark) 100%)",
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 55%, rgba(13,13,15,0.35) 100%)",
        }}
      />

      {/* Content — Tesla positions at bottom center */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div style={{ flex: 1 }} />
        <HeroContent />
        <ScrollCue />
      </div>
    </section>
  );
}

function HeroContent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        paddingBottom: "clamp(56px, 9vh, 96px)",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <p
        className="tesla-label"
        style={{
          marginBottom: "12px",
          color: "rgba(255,255,255,0.5)",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "all 0.7s ease 0s",
        }}
      >
        Cybertruck Experience · Limited Availability
      </p>

      <h1
        className="t-display"
        style={{
          color: "var(--pure-white)",
          marginBottom: "12px",
          fontWeight: 500,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "all 0.7s ease 0.1s",
        }}
      >
        Drive the future.
      </h1>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.875rem, 1.6vw, 1rem)",
          fontWeight: 300,
          color: "rgba(255,255,255,0.5)",
          marginBottom: "28px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "all 0.7s ease 0.2s",
        }}
      >
        Get behind the wheel of the Cyberbeast — or ride along. Today.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "all 0.7s ease 0.3s",
        }}
      >
        <a href="#book" className="btn-tesla-accent">Book a Ride</a>
      </div>
    </div>
  );
}

function ScrollCue() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingBottom: "24px",
        zIndex: 10,
        position: "relative",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ opacity: 0.4, animation: "scrollBob 2.2s ease-in-out infinite" }}
      >
        <path
          d="M10 4v12M5 11l5 5 5-5"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style>{`
        @keyframes scrollBob {
          0%,100% { opacity:0.38; transform:translateY(0); }
          50% { opacity:0.6; transform:translateY(5px); }
        }
      `}</style>
    </div>
  );
}
