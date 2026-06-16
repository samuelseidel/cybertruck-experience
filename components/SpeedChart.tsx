"use client";

import { useEffect, useRef, useState } from "react";

const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

const competitors = [
  { name: "Cybertruck CyberBeast", time: 2.9, highlight: true, sub: "Electric · All-Wheel Drive" },
  { name: "Porsche 911 GT3", time: 3.4, highlight: false, sub: "Petrol · Rear-Wheel Drive" },
  { name: "Lamborghini Urus Performante", time: 3.3, highlight: false, sub: "Petrol · All-Wheel Drive" },
  { name: "Mercedes-AMG GT 63 S 4-Door", time: 3.2, highlight: false, sub: "Petrol · All-Wheel Drive" },
  { name: "Audi R8 V10 Performance", time: 3.1, highlight: false, sub: "Petrol · All-Wheel Drive" },
  { name: "BMW M3 Competition xDrive", time: 3.5, highlight: false, sub: "Petrol · All-Wheel Drive" },
  { name: "Dodge Challenger SRT Hellcat", time: 3.7, highlight: false, sub: "Petrol · Rear-Wheel Drive" },
  { name: "Ford F-150 Raptor R", time: 4.5, highlight: false, sub: "Petrol V8 · All-Wheel Drive" },
];

const MAX_TIME = 5.0;

function Bar({ name, time, highlight, sub, index, allVisible }: typeof competitors[0] & { index: number; allVisible: boolean }) {
  const pct = (time / MAX_TIME) * 100;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(12px, 2vw, 20px)",
        opacity: allVisible ? 1 : 0,
        transform: allVisible ? "none" : "translateX(-20px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      {/* Car name */}
      <div
        style={{
          width: "clamp(160px, 22vw, 280px)",
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
            fontWeight: highlight ? 600 : 400,
            color: highlight ? "var(--pure-white)" : "var(--subtle-gray)",
            lineHeight: 1.2,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.6875rem",
            fontWeight: 400,
            color: highlight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
            marginTop: "2px",
          }}
        >
          {sub}
        </p>
      </div>

      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: highlight ? "36px" : "28px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "3px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: allVisible ? `${pct}%` : "0%",
            background: highlight
              ? "linear-gradient(90deg, var(--tesla-blue) 0%, #5580e8 100%)"
              : "rgba(255,255,255,0.12)",
            borderRadius: "3px",
            transition: `width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 80 + 200}ms`,
          }}
        />
        {/* Glow for highlight */}
        {highlight && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: allVisible ? `${pct}%` : "0%",
              background: "rgba(62,106,225,0.3)",
              filter: "blur(8px)",
              borderRadius: "3px",
              transition: `width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 80 + 200}ms`,
            }}
          />
        )}
      </div>

      {/* Time label */}
      <div style={{ width: "52px", flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: highlight ? "1.25rem" : "0.9375rem",
            fontWeight: highlight ? 300 : 300,
            color: highlight ? "var(--pure-white)" : "var(--steel)",
            letterSpacing: "-0.02em",
          }}
        >
          {time.toFixed(1)}s
        </span>
      </div>
    </div>
  );
}

export default function SpeedChart() {
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

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-dark)",
      }}
    >
      {/* Background photo — low opacity */}
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
          objectPosition: "center 40%",
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, var(--bg-dark) 40%, rgba(13,13,15,0.85) 100%)",
        }}
      />

      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "clamp(72px, 10vw, 120px) 24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "clamp(40px, 6vw, 64px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition: "all 0.75s ease",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Performance</p>
          <h2
            className="t-heading-lg"
            style={{ color: "var(--pure-white)", marginBottom: "16px" }}
          >
            Faster than you&apos;d ever expect
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9375rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
              maxWidth: "520px",
              lineHeight: 1.65,
            }}
          >
            The Cyberbeast reaches 100 km/h in under 3 seconds — beating sports cars that cost twice as much and weigh half as much. This is a truck.
          </p>
        </div>

        {/* 0–100 label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 2vw, 20px)",
            marginBottom: "20px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease 0.3s",
          }}
        >
          <div style={{ width: "clamp(160px, 22vw, 280px)", flexShrink: 0 }} />
          <p
            className="tesla-label"
            style={{ flex: 1, color: "rgba(255,255,255,0.25)" }}
          >
            0–100 km/h (0–62 mph)
          </p>
          <div style={{ width: "52px" }} />
        </div>

        {/* Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {competitors.map((car, i) => (
            <Bar key={car.name} {...car} index={i} allVisible={visible} />
          ))}
        </div>

        {/* Footnote */}
        <p
          style={{
            marginTop: "32px",
            fontFamily: "var(--font-display)",
            fontSize: "0.6875rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.2)",
            lineHeight: 1.5,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease 0.8s",
          }}
        >
          Times represent manufacturer-stated 0–100 km/h (0–62 mph). Cybertruck CyberBeast time based on Tesla official specification. Competitor times from manufacturer press releases.
        </p>
      </div>
    </section>
  );
}
