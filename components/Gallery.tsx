"use client";

import { useEffect, useRef, useState } from "react";

const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

const items = [
  {
    id: "design",
    label: "Design",
    title: "An Exoskeleton Built to Last",
    img: `${CDN}/Cybertruck-End-of-Page-Desktop.jpg`,
    imgPos: "center 40%",
  },
  {
    id: "cockpit",
    label: "Cockpit",
    title: "Everything in view",
    img: `${CDN}/Cybertruck-Human-Meet-Machine-Desktop.png`,
    imgPos: "center 20%",
  },
  {
    id: "charging",
    label: "Connectivity",
    title: "Dual wireless charging",
    img: `${CDN}/Cybertruck-Human-Meet-Machine-Carousel-Slide-3-Charging-Desktop.png`,
    imgPos: "center center",
  },
  {
    id: "offroad",
    label: "Off-Road",
    title: "Into the wild",
    img: `${CDN}/Cybertruck-Into-The-Wild-Desktop.jpg`,
    imgPos: "center 30%",
  },
];

function GalleryCell({
  id,
  label,
  title,
  img,
  imgPos,
  delay,
}: (typeof items)[0] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      id={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        height: "100%",
        minHeight: "200px",
      }}
    >
      {/* Photo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: imgPos,
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />

      {/* Gradient overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Border overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: hovered ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: "var(--radius-card)",
          transition: "border-color 0.2s ease",
        }}
      />

      {/* Top: label + arrow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <span className="tesla-label" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            opacity: hovered ? 0.9 : 0.4,
            transform: hovered ? "translate(2px,-2px)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <path d="M3 13L13 3M13 3H7M13 3v6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Bottom: title */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const headRef = useRef<HTMLDivElement>(null);
  const [headVisible, setHeadVisible] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeadVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="gallery"
      style={{
        background: "var(--bg-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        position: "relative",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <div
          ref={headRef}
          style={{
            marginBottom: "clamp(40px, 6vw, 64px)",
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "none" : "translateY(32px)",
            transition: "all 0.75s ease",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Explore</p>
          <h2 className="t-heading-lg" style={{ color: "var(--pure-white)" }}>
            Every Detail, Engineered
          </h2>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "360px 220px",
            gap: "12px",
          }}
        >
          {/* Design — large */}
          <div style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
            <GalleryCell {...items[0]} delay={0} />
          </div>
          {/* Cockpit */}
          <div style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }}>
            <GalleryCell {...items[1]} delay={100} />
          </div>
          {/* Connectivity */}
          <div style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}>
            <GalleryCell {...items[2]} delay={200} />
          </div>
        </div>

        {/* Off-Road — full width */}
        <div style={{ marginTop: "12px", height: "200px" }}>
          <GalleryCell {...items[3]} delay={300} />
        </div>
      </div>
    </section>
  );
}
