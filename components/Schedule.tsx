"use client";

import { useEffect, useRef, useState } from "react";

type Slot = { time: string; spots: number };
type TourDate = { label: string; iso: string; slots: Slot[] };
type Tour = { id: string; city: string; address: string; range: string; dates: TourDate[] };

function makeSlots(p: number[]): Slot[] {
  const times = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00","17:30",
  ];
  return times.map((t, i) => ({ time: t, spots: p[i] ?? 3 }));
}

// 0 = full · 1-2 = limited · 3 = open
const TOURS: Tour[] = [
  {
    id: "prague", city: "Prague", address: "Experience Hub, Letňany", range: "5–6 Jul",
    dates: [
      { label: "Sat 5 Jul", iso: "2026-07-05", slots: makeSlots([0,0,0,1,0,2,3,0,1,0,3,0,2,3,1,0,3,3]) },
      { label: "Sun 6 Jul", iso: "2026-07-06", slots: makeSlots([0,1,3,0,2,3,1,3,0,3,2,3,0,3,3,1,3,3]) },
    ],
  },
  {
    id: "brno", city: "Brno", address: "BVV Exhibition Centre", range: "10–12 Jul",
    dates: [
      { label: "Fri 10 Jul", iso: "2026-07-10", slots: makeSlots([3,3,0,3,3,2,3,3,0,3,3,2,3,3,3,2,3,3]) },
      { label: "Sat 11 Jul", iso: "2026-07-11", slots: makeSlots([3,3,3,2,3,3,3,2,3,3,3,3,2,3,3,3,3,3]) },
      { label: "Sun 12 Jul", iso: "2026-07-12", slots: makeSlots([3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]) },
    ],
  },
  {
    id: "hradec", city: "Hradec Králové", address: "Aupark Hradec Králové", range: "18–20 Jul",
    dates: [
      { label: "Sat 18 Jul", iso: "2026-07-18", slots: makeSlots([3,3,3,3,2,3,3,3,3,3,2,3,3,3,3,3,3,3]) },
      { label: "Sun 19 Jul", iso: "2026-07-19", slots: makeSlots([3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]) },
      { label: "Mon 20 Jul", iso: "2026-07-20", slots: makeSlots([3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]) },
    ],
  },
  {
    id: "ostrava", city: "Ostrava", address: "Forum Nová Karolina", range: "1–3 Aug",
    dates: [
      { label: "Sat 1 Aug",  iso: "2026-08-01", slots: makeSlots([3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]) },
      { label: "Sun 2 Aug",  iso: "2026-08-02", slots: makeSlots([3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]) },
      { label: "Mon 3 Aug",  iso: "2026-08-03", slots: makeSlots([3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]) },
    ],
  },
];

export default function Schedule() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tourIdx, setTourIdx] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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

  const tour = TOURS[tourIdx];
  const dateEntry = tour.dates[dateIdx];

  function pickTour(i: number) { setTourIdx(i); setDateIdx(0); setSelectedTime(null); }
  function pickDate(i: number) { setDateIdx(i); setSelectedTime(null); }

  function bookSlot() {
    sessionStorage.setItem("selectedSlot", JSON.stringify({
      city: tour.city,
      address: tour.address,
      date: dateEntry.label,
      iso: dateEntry.iso,
      time: selectedTime,
    }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="schedule"
      ref={ref}
      style={{
        background: "var(--bg-dark)",
        padding: "clamp(80px, 12vw, 140px) 24px",
        position: "relative",
      }}
    >
      <div className="tesla-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "clamp(40px, 6vw, 64px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition: "all 0.75s ease",
          }}
        >
          <p className="tesla-label" style={{ marginBottom: "16px" }}>Tour Schedule 2026</p>
          <h2 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "12px" }}>
            Where we&apos;re heading.
          </h2>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 300,
            color: "var(--subtle-gray)",
            maxWidth: "460px",
            lineHeight: 1.65,
          }}>
            Pick a city, choose your slot, and we&apos;ll confirm your booking within the hour.
          </p>
        </div>

        {/* City tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "24px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.75s ease 0.1s",
          }}
        >
          {TOURS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => pickTour(i)}
              style={{
                padding: "12px 20px",
                background: tourIdx === i ? "rgba(62,106,225,0.12)" : "rgba(255,255,255,0.04)",
                border: tourIdx === i ? "1px solid rgba(62,106,225,0.45)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-card)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: tourIdx === i ? "var(--pure-white)" : "var(--subtle-gray)",
                marginBottom: "2px",
              }}>
                {t.city}
              </p>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.6875rem",
                fontWeight: 300,
                color: tourIdx === i ? "rgba(62,106,225,0.85)" : "var(--steel)",
              }}>
                {t.range}
              </p>
            </button>
          ))}
        </div>

        {/* Date + slot panel */}
        <div
          style={{
            background: "var(--surface-dark)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-card)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.75s ease 0.15s",
          }}
        >
          {/* Address bar */}
          <div style={{
            padding: "14px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="rgba(255,255,255,0.35)" />
            </svg>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8125rem",
              fontWeight: 300,
              color: "var(--subtle-gray)",
            }}>
              {tour.address}
            </span>
          </div>

          {/* Date tabs */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid var(--border-subtle)",
            overflowX: "auto",
          }}>
            {tour.dates.map((d, i) => {
              const open = d.slots.filter(s => s.spots > 0).length;
              return (
                <button
                  key={d.iso}
                  onClick={() => pickDate(i)}
                  style={{
                    flex: "0 0 auto",
                    padding: "14px 20px",
                    background: dateIdx === i ? "rgba(62,106,225,0.06)" : "transparent",
                    border: "none",
                    borderBottom: dateIdx === i ? "2px solid var(--tesla-blue)" : "2px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.875rem",
                    fontWeight: dateIdx === i ? 500 : 400,
                    color: dateIdx === i ? "var(--pure-white)" : "var(--subtle-gray)",
                    marginBottom: "3px",
                  }}>
                    {d.label}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.6875rem",
                    fontWeight: 300,
                    color: open > 4
                      ? "rgba(100,190,100,0.75)"
                      : open > 0
                      ? "rgba(255,160,50,0.75)"
                      : "rgba(255,80,80,0.6)",
                  }}>
                    {open > 0 ? `${open} open` : "Sold out"}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Slot grid */}
          <div style={{ padding: "24px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
              gap: "8px",
              marginBottom: "20px",
            }}>
              {dateEntry.slots.map(({ time, spots }) => {
                const full    = spots === 0;
                const scarce  = spots > 0 && spots <= 2;
                const sel     = selectedTime === time;

                return (
                  <button
                    key={time}
                    disabled={full}
                    onClick={() => setSelectedTime(sel ? null : time)}
                    style={{
                      padding: "10px 4px",
                      textAlign: "center",
                      background: sel
                        ? "rgba(62,106,225,0.15)"
                        : full
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.04)",
                      border: sel
                        ? "1px solid rgba(62,106,225,0.6)"
                        : scarce
                        ? "1px solid rgba(255,160,50,0.4)"
                        : full
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                      cursor: full ? "not-allowed" : "pointer",
                      transition: "all 0.12s ease",
                    }}
                  >
                    <span style={{
                      display: "block",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.8125rem",
                      fontWeight: sel ? 500 : 400,
                      color: full
                        ? "rgba(255,255,255,0.18)"
                        : sel
                        ? "var(--tesla-blue)"
                        : scarce
                        ? "rgba(255,160,50,0.9)"
                        : "var(--pure-white)",
                    }}>
                      {time}
                    </span>
                    {scarce && !sel && (
                      <span style={{
                        display: "block",
                        fontSize: "0.6rem",
                        color: "rgba(255,160,50,0.6)",
                        marginTop: "2px",
                        letterSpacing: "0.03em",
                      }}>
                        {spots} left
                      </span>
                    )}
                    {full && (
                      <span style={{
                        display: "block",
                        fontSize: "0.6rem",
                        color: "rgba(255,255,255,0.18)",
                        marginTop: "2px",
                        letterSpacing: "0.03em",
                      }}>
                        Full
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { color: "rgba(255,255,255,0.35)", label: "Available" },
                { color: "rgba(255,160,50,0.75)", label: "Limited" },
                { color: "rgba(255,255,255,0.18)", label: "Full" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    color: "var(--steel)",
                  }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm bar — appears when a slot is selected */}
          {selectedTime && (
            <div style={{
              padding: "18px 24px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              background: "rgba(62,106,225,0.05)",
            }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--subtle-gray)",
                  marginBottom: "4px",
                }}>
                  Selected slot
                </p>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9375rem",
                  fontWeight: 400,
                  color: "var(--pure-white)",
                }}>
                  {tour.city} · {dateEntry.label} · {selectedTime}
                </p>
              </div>
              <button onClick={bookSlot} className="btn-tesla-accent">
                Book This Slot
              </button>
            </div>
          )}
        </div>

        {/* Pricing footnote */}
        <p style={{
          marginTop: "20px",
          fontFamily: "var(--font-display)",
          fontSize: "0.75rem",
          fontWeight: 300,
          color: "var(--steel)",
          textAlign: "center",
        }}>
          Discovery (30 min) · €149 &nbsp;·&nbsp; Full Power (60 min) · €249 &nbsp;·&nbsp; Elite (120 min) · €499 &nbsp;·&nbsp; Insurance included
        </p>
      </div>
    </section>
  );
}
