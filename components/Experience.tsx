"use client";

import { useEffect, useRef, useState } from "react";

const CDN = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";
const VIDEO_CDN = "https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto:best";

const sections = [
  {
    id: "acceleration",
    label: "Acceleration",
    heading: "Feel 835 horses launch",
    body: "Before you're ready, 0–60 hits in 2.6 seconds. Pinned to your seat, the electric silence makes the speed feel surreal. The tri-motor powertrain delivers instant torque to all four wheels simultaneously.",
    align: "left" as const,
    bg: "var(--bg-dark)",
    img: `${CDN}/Cybertruck-Second-Hero-Desktop.jpg`,
    video: `${VIDEO_CDN}/Cybertruck-Dopamine-On-Tap-Desktop.mp4`,
    imgAlt: "Cybertruck accelerating on red terrain",
    imgPos: "center center",
  },
  {
    id: "interior",
    label: "Interior",
    heading: "A cabin unlike anything else",
    body: "Six seats, panoramic glass, and an 18.5-inch cinematic display. The Cybertruck cabin is a command center and sanctuary — engineered to make every mile feel extraordinary.",
    align: "right" as const,
    bg: "var(--surface-dark)",
    img: `${CDN}/Cybertruck-Expand-Your-Horizon-Desktop.png`,
    video: null,
    imgAlt: "Cybertruck interior with panoramic glass roof showing the Milky Way",
    imgPos: "center center",
  },
  {
    id: "exterior",
    label: "Exterior",
    heading: "Ultra-Hard stainless steel",
    body: "30X Cold-Rolled Stainless Steel that won't dent, won't rust, and won't need paint. An angular exoskeleton that isn't just distinctive — it's structurally superior.",
    align: "left" as const,
    bg: "var(--bg-dark)",
    img: `${CDN}/Cybertruck-No-Paint-No-Chips-Desktop-STATIC.png`,
    video: null,
    imgAlt: "Stainless steel impact test",
    imgPos: "center center",
  },
  {
    id: "vault",
    label: "Vault",
    heading: "Packed for any mission",
    body: "A 6-foot powered vault with lockable tonneau cover. On-board air compressor. 2.8-cu-ft frunk. Power outlets front and rear. Carry kayaks, climb gear, or a week's worth of supplies — the Cybertruck does the heavy lifting.",
    align: "right" as const,
    bg: "var(--surface-dark)",
    img: `${CDN}/Cybertruck-PLL-Load-Desktop.png`,
    video: null,
    imgAlt: "Cybertruck loaded with kayaks at the water",
    imgPos: "center 40%",
  },
];

function MediaPanel({ img, video, imgAlt, imgPos, visible, bg, textOnLeft }: {
  img: string;
  video: string | null;
  imgAlt: string;
  imgPos: string;
  visible: boolean;
  bg: string;
  textOnLeft: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!video || !videoRef.current) return;
    const v = videoRef.current;
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady);
    v.load();
    return () => v.removeEventListener("canplay", onReady);
  }, [video]);

  const transitionStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(1.06)",
    transition: "opacity 1s ease 0.1s, transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s",
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    objectPosition: imgPos,
  };

  return (
    <>
      {/* Poster / fallback image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={imgAlt}
        style={{
          ...transitionStyle,
          opacity: visible ? (video && videoReady ? 0 : 1) : 0,
        }}
      />

      {/* Video (acceleration section only) */}
      {video && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            ...transitionStyle,
            opacity: visible && videoReady ? 1 : 0,
          }}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {/* Edge blend toward text panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: textOnLeft
            ? `linear-gradient(to right, ${bg} 0%, transparent 20%)`
            : `linear-gradient(to left, ${bg} 0%, transparent 20%)`,
          zIndex: 1,
        }}
      />
    </>
  );
}

function ExperienceSection({
  id,
  label,
  heading,
  body,
  align,
  bg,
  img,
  video,
  imgAlt,
  imgPos,
}: (typeof sections)[0]) {
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

  const textOnLeft = align === "left";

  return (
    <section
      id={id}
      ref={ref}
      style={{
        background: bg,
        position: "relative",
        minHeight: "clamp(500px, 80vh, 800px)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }} />

      <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>

        {/* Text panel */}
        <div
          style={{
            order: textOnLeft ? 0 : 1,
            flex: "1 1 360px",
            display: "flex",
            alignItems: "center",
            padding: "clamp(56px, 8vw, 96px) clamp(24px, 5vw, 72px)",
            position: "relative",
            zIndex: 2,
            background: bg,
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : `translateX(${textOnLeft ? "-40px" : "40px"})`,
              transition: "all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            <p className="tesla-label" style={{ marginBottom: "16px" }}>{label}</p>
            <h2
              className="t-heading-lg"
              style={{ color: "var(--pure-white)", marginBottom: "20px" }}
            >
              {heading}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 300,
                color: "var(--subtle-gray)",
                lineHeight: 1.7,
                marginBottom: "36px",
              }}
            >
              {body}
            </p>
            <a href="#contact" className="btn-tesla-accent">
              Book Experience
            </a>
          </div>
        </div>

        {/* Photo / Video panel */}
        <div
          style={{
            order: textOnLeft ? 1 : 0,
            flex: "1 1 360px",
            position: "relative",
            minHeight: "clamp(300px, 60vw, 700px)",
            overflow: "hidden",
          }}
        >
          <MediaPanel
            img={img}
            video={video}
            imgAlt={imgAlt}
            imgPos={imgPos}
            visible={visible}
            bg={bg}
            textOnLeft={textOnLeft}
          />
        </div>
      </div>
    </section>
  );
}

export default function Experience() {
  return (
    <div id="experience">
      {sections.map((s) => (
        <ExperienceSection key={s.id} {...s} />
      ))}
    </div>
  );
}
