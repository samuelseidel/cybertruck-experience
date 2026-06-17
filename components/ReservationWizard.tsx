"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// ─── Tour data ───────────────────────────────────────────────────────

type Slot     = { time: string; spots: number };
type TourDate = { label: string; iso: string; slots: Slot[] };
type Tour     = { id: string; city: string; address: string; range: string; dates: TourDate[] };

function makeSlots(p: number[]): Slot[] {
  const times = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00","17:30",
  ];
  return times.map((t, i) => ({ time: t, spots: p[i] ?? 3 }));
}

const TOURS: Tour[] = [
  {
    id: "prague", city: "Prague", address: "Experience Hub, Letňany", range: "5–6 Jul",
    dates: [
      { label: "Sat 5 Jul",  iso: "2026-07-05", slots: makeSlots([0,0,0,1,0,2,3,0,1,0,3,0,2,3,1,0,3,3]) },
      { label: "Sun 6 Jul",  iso: "2026-07-06", slots: makeSlots([0,1,3,0,2,3,1,3,0,3,2,3,0,3,3,1,3,3]) },
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

const PACKAGES = [
  { id: "discovery", name: "Discovery", duration: "30 min", price: "€149", desc: "Guided city route" },
  { id: "full",      name: "Full Power", duration: "60 min", price: "€249", desc: "Highway + city" },
  { id: "elite",     name: "Elite",      duration: "120 min", price: "€499", desc: "Private session" },
];

// ─── Left panel images (Tesla discovery CDN → tesla-contents fallback) ─

const DISC = "https://digitalassets.tesla.com/discovery-tesla-com/image/upload/f_auto,q_auto";
const CT   = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto";

const LEFT_IMAGES = [
  { src: `${DISC}/Selector-Cybertruck-Desktop-No-Vehicle-Selector.png`, fallback: `${CT}/Cybertruck-Second-Hero-Desktop.jpg`,           pos: "center 40%" },
  { src: `${DISC}/Selector-Cybertruck-Desktop.png`,                     fallback: `${CT}/Cybertruck-Main-Hero-Desktop.jpg`,             pos: "center 40%" },
  { src: `${DISC}/Form-Cybertruck-Desktop-Modify-Appointment.png`,      fallback: `${CT}/Cybertruck-No-Paint-No-Chips-Desktop-STATIC.png`, pos: "center center" },
  { src: `${DISC}/Confirmation-Ready-To-Drive-Desktop.png`,             fallback: `${CT}/Cybertruck-Into-The-Wild-Desktop.jpg`,         pos: "center 30%" },
];

const LEFT_COPY = [
  "Choose your city.",
  "Pick your time slot.",
  "Almost there.",
  "See you there.",
];

// ─── Booking state ──────────────────────────────────────────────────

interface Booking {
  cityId: string; city: string; address: string;
  dateIdx: number; dateLabel: string; dateIso: string; time: string;
  package: string;
  firstName: string; lastName: string; email: string; phone: string;
}

function initBooking(initialCity?: string, initialDate?: string, initialTime?: string): { booking: Booking; step: number } {
  const empty: Booking = {
    cityId: "", city: "", address: "",
    dateIdx: 0, dateLabel: "", dateIso: "", time: "",
    package: "discovery",
    firstName: "", lastName: "", email: "", phone: "",
  };
  if (!initialCity) return { booking: empty, step: 0 };
  const tour = TOURS.find(t => t.id === initialCity);
  if (!tour) return { booking: empty, step: 0 };
  const dateIdx = initialDate ? Math.max(0, tour.dates.findIndex(d => d.iso === initialDate)) : 0;
  const dateEntry = tour.dates[dateIdx];
  return {
    booking: { ...empty, cityId: tour.id, city: tour.city, address: tour.address, dateIdx, dateLabel: dateEntry.label, dateIso: dateEntry.iso, time: initialTime ?? "" },
    step: initialTime ? 2 : 1,
  };
}

// ─── Main component ─────────────────────────────────────────────────

export default function ReservationWizard({
  initialCity, initialDate, initialTime,
}: {
  initialCity?: string; initialDate?: string; initialTime?: string;
}) {
  const { booking: init, step: initStep } = initBooking(initialCity, initialDate, initialTime);
  const [step, setStep]       = useState(initStep);
  const [booking, setBooking] = useState<Booking>(init);
  const rightRef = useRef<HTMLDivElement>(null);

  const tour = TOURS.find(t => t.id === booking.cityId);

  function goStep(n: number) {
    setStep(n);
    rightRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        .rw-left { display: flex !important; }
        @media (max-width: 768px) {
          .rw-left { display: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", height: "100svh", overflow: "hidden", background: "var(--bg-dark)" }}>

        {/* ── Left panel ── */}
        <div className="rw-left" style={{ flexShrink: 0, width: "42%", position: "relative", overflow: "hidden" }}>
          {LEFT_IMAGES.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img.src}
              alt=""
              aria-hidden
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
            {step < 3 && (
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>
                Step {step + 1} of 3
              </p>
            )}
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
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.16em", color: "var(--pure-white)" }}>
              CYBERTRUCK
            </span>

            <Link href="/" style={{ display: "flex", alignItems: "center", color: "var(--subtle-gray)", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>

          {/* Step progress bar */}
          {step < 3 && (
            <div style={{ flexShrink: 0, display: "flex", gap: "4px", padding: "16px clamp(24px,5vw,64px) 0" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  flex: 1, height: "2px", borderRadius: "1px",
                  background: i <= step ? "var(--tesla-blue)" : "rgba(255,255,255,0.1)",
                  transition: "background 0.4s ease",
                }} />
              ))}
            </div>
          )}

          {/* Step content */}
          <div style={{ flex: 1, padding: "clamp(32px,5vw,56px) clamp(24px,5vw,64px)" }}>
            {step === 0 && <CityStep    booking={booking} setBooking={setBooking} onNext={() => goStep(1)} />}
            {step === 1 && tour && <DateTimeStep tour={tour} booking={booking} setBooking={setBooking} onNext={() => goStep(2)} />}
            {step === 2 && <DetailsStep  booking={booking} setBooking={setBooking} onNext={() => goStep(3)} />}
            {step === 3 && <ConfirmedStep booking={booking} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Step 1: City ───────────────────────────────────────────────────

function CityStep({ booking, setBooking, onNext }: { booking: Booking; setBooking: (b: Booking) => void; onNext: () => void }) {
  function selectCity(t: Tour) {
    const d = t.dates[0];
    setBooking({ ...booking, cityId: t.id, city: t.city, address: t.address, dateIdx: 0, dateLabel: d.label, dateIso: d.iso, time: "" });
  }

  return (
    <div>
      <p className="tesla-label" style={{ marginBottom: "12px" }}>Step 1 of 3</p>
      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "8px" }}>Choose your city.</h1>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "36px", maxWidth: "420px" }}>
        The Cybertruck is touring the Czech Republic this summer. Pick the location closest to you.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
        {TOURS.map(t => {
          const totalOpen = t.dates.reduce((s, d) => s + d.slots.filter(sl => sl.spots > 0).length, 0);
          const sel = booking.cityId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => selectCity(t)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px",
                background: sel ? "rgba(62,106,225,0.09)" : "rgba(255,255,255,0.04)",
                border: sel ? "1px solid rgba(62,106,225,0.45)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius-card)", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s ease", gap: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "3px" }}>
                  {t.city}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>
                  {t.address}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 400, color: sel ? "rgba(62,106,225,0.85)" : "var(--subtle-gray)", marginBottom: "3px" }}>
                  {t.range}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: totalOpen > 10 ? "rgba(100,190,100,0.75)" : totalOpen > 0 ? "rgba(255,160,50,0.75)" : "rgba(255,80,80,0.6)" }}>
                  {totalOpen > 0 ? `${totalOpen} slots open` : "Sold out"}
                </p>
              </div>
              <div style={{
                flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%",
                border: sel ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                background: sel ? "var(--tesla-blue)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
              }}>
                {sel && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </button>
          );
        })}
      </div>

      <button onClick={onNext} disabled={!booking.cityId} className="btn-tesla-accent"
        style={{ width: "100%", justifyContent: "center", height: "48px", opacity: booking.cityId ? 1 : 0.4 }}>
        Continue
      </button>
    </div>
  );
}

// ─── Step 2: Date + Time ─────────────────────────────────────────────

function DateTimeStep({ tour, booking, setBooking, onNext }: { tour: Tour; booking: Booking; setBooking: (b: Booking) => void; onNext: () => void }) {
  const dateEntry = tour.dates[booking.dateIdx];

  function pickDate(i: number) {
    const d = tour.dates[i];
    setBooking({ ...booking, dateIdx: i, dateLabel: d.label, dateIso: d.iso, time: "" });
  }
  function pickTime(time: string) {
    setBooking({ ...booking, time: booking.time === time ? "" : time });
  }

  return (
    <div>
      <p className="tesla-label" style={{ marginBottom: "12px" }}>Step 2 of 3</p>
      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "4px" }}>{tour.city}</h1>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 300, color: "var(--subtle-gray)", marginBottom: "32px" }}>{tour.address}</p>

      {/* Date tabs */}
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--subtle-gray)", marginBottom: "10px" }}>
        Select a date
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        {tour.dates.map((d, i) => {
          const open = d.slots.filter(s => s.spots > 0).length;
          const sel  = booking.dateIdx === i;
          return (
            <button key={d.iso} onClick={() => pickDate(i)} style={{
              padding: "10px 16px",
              background: sel ? "rgba(62,106,225,0.1)" : "rgba(255,255,255,0.04)",
              border: sel ? "1px solid rgba(62,106,225,0.45)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px", cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: sel ? 500 : 400, color: sel ? "var(--pure-white)" : "var(--subtle-gray)", marginBottom: "2px" }}>{d.label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 300, color: open > 4 ? "rgba(100,190,100,0.75)" : open > 0 ? "rgba(255,160,50,0.75)" : "rgba(255,80,80,0.6)" }}>
                {open > 0 ? `${open} open` : "Full"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Slot grid */}
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--subtle-gray)", marginBottom: "10px" }}>
        Select a time
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: "8px", marginBottom: "20px" }}>
        {dateEntry.slots.map(({ time, spots }) => {
          const full   = spots === 0;
          const scarce = spots > 0 && spots <= 2;
          const sel    = booking.time === time;
          return (
            <button key={time} disabled={full} onClick={() => pickTime(time)} style={{
              padding: "10px 4px", textAlign: "center",
              background: sel ? "rgba(62,106,225,0.15)" : full ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
              border: sel ? "1px solid rgba(62,106,225,0.6)" : scarce ? "1px solid rgba(255,160,50,0.4)" : full ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px", cursor: full ? "not-allowed" : "pointer", transition: "all 0.12s ease",
            }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: sel ? 500 : 400, color: full ? "rgba(255,255,255,0.18)" : sel ? "var(--tesla-blue)" : scarce ? "rgba(255,160,50,0.9)" : "var(--pure-white)" }}>{time}</span>
              {scarce && !sel && <span style={{ display: "block", fontSize: "0.6rem", color: "rgba(255,160,50,0.6)", marginTop: "2px" }}>{spots} left</span>}
              {full    && <span style={{ display: "block", fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", marginTop: "2px" }}>Full</span>}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
        {[{ color: "rgba(255,255,255,0.35)", label: "Available" }, { color: "rgba(255,160,50,0.75)", label: "Limited" }, { color: "rgba(255,255,255,0.18)", label: "Full" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>{label}</span>
          </div>
        ))}
      </div>

      <button onClick={onNext} disabled={!booking.time} className="btn-tesla-accent"
        style={{ width: "100%", justifyContent: "center", height: "48px", opacity: booking.time ? 1 : 0.4 }}>
        Continue
      </button>
      <p style={{ textAlign: "center", marginTop: "12px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
        Session duration (30 / 60 / 120 min) is chosen on the next step
      </p>
    </div>
  );
}

// ─── Step 3: Details ─────────────────────────────────────────────────

function DetailsStep({ booking, setBooking, onNext }: { booking: Booking; setBooking: (b: Booking) => void; onNext: () => void }) {
  const valid = booking.firstName && booking.lastName && booking.email && booking.phone;

  const inp = {
    width: "100%", height: "48px", padding: "0 16px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
    fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--pure-white)",
    outline: "none", transition: "border-color 0.15s ease, background 0.15s ease",
  } as React.CSSProperties;

  const lbl = {
    display: "block", fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--subtle-gray)", marginBottom: "8px",
  };

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "rgba(62,106,225,0.5)";
    e.currentTarget.style.background  = "rgba(255,255,255,0.07)";
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
    e.currentTarget.style.background  = "rgba(255,255,255,0.05)";
  }

  return (
    <div>
      <p className="tesla-label" style={{ marginBottom: "12px" }}>Step 3 of 3</p>
      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "8px" }}>Your details.</h1>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.6, marginBottom: "28px" }}>
        Almost there — a few details to confirm your booking.
      </p>

      {/* Slot summary */}
      <div style={{ padding: "14px 18px", background: "rgba(62,106,225,0.07)", border: "1px solid rgba(62,106,225,0.2)", borderRadius: "var(--radius-card)", marginBottom: "24px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(62,106,225,0.7)", marginBottom: "5px" }}>Your slot</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "2px" }}>
          {booking.city} · {booking.dateLabel} · {booking.time}
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{booking.address}</p>
      </div>

      {/* Package selection */}
      <p style={lbl}>Session</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {PACKAGES.map(pkg => {
          const sel = booking.package === pkg.id;
          return (
            <button key={pkg.id} onClick={() => setBooking({ ...booking, package: pkg.id })} style={{
              flex: 1, padding: "14px 8px", textAlign: "center",
              background: sel ? "rgba(62,106,225,0.1)" : "rgba(255,255,255,0.04)",
              border: sel ? "1px solid rgba(62,106,225,0.45)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px", cursor: "pointer", transition: "all 0.15s ease",
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.05em", color: sel ? "rgba(62,106,225,0.85)" : "var(--steel)", marginBottom: "3px" }}>{pkg.duration}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 500, color: sel ? "var(--pure-white)" : "var(--subtle-gray)", marginBottom: "2px" }}>{pkg.name}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 400, color: sel ? "var(--tesla-blue)" : "var(--subtle-gray)" }}>{pkg.price}</p>
            </button>
          );
        })}
      </div>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
        {[{ key: "firstName" as const, label: "First Name", ph: "Jane" }, { key: "lastName" as const, label: "Last Name", ph: "Smith" }].map(({ key, label, ph }) => (
          <div key={key}>
            <label style={lbl}>{label}</label>
            <input style={inp} type="text" required placeholder={ph} value={booking[key]}
              onChange={e => setBooking({ ...booking, [key]: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={lbl}>Email</label>
        <input style={inp} type="email" required placeholder="you@example.com" value={booking.email}
          onChange={e => setBooking({ ...booking, email: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label style={lbl}>Phone</label>
        <input style={inp} type="tel" placeholder="+420 600 000 000" value={booking.phone}
          onChange={e => setBooking({ ...booking, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
      </div>

      <button onClick={onNext} disabled={!valid} className="btn-tesla-accent"
        style={{ width: "100%", justifyContent: "center", height: "48px", opacity: valid ? 1 : 0.4 }}>
        Reserve My Slot
      </button>
      <p style={{ textAlign: "center", marginTop: "14px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)", lineHeight: 1.5 }}>
        €49 deposit by email within the hour · Fully refundable 48h before your session
      </p>
    </div>
  );
}

// ─── Step 4: Confirmed ───────────────────────────────────────────────

function ConfirmedStep({ booking }: { booking: Booking }) {
  const pkg = PACKAGES.find(p => p.id === booking.package) || PACKAGES[0];

  return (
    <div style={{ textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "50%",
        background: "rgba(62,106,225,0.12)", border: "1px solid rgba(62,106,225,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px",
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M7 14l5 5 9-9" stroke="var(--tesla-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "12px" }}>Slot Reserved</h1>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "36px" }}>
        We&apos;ll confirm your booking at <strong style={{ color: "var(--pure-white)" }}>{booking.email}</strong> within the hour with deposit payment instructions.
      </p>

      {/* Booking summary */}
      <div style={{ padding: "20px 24px", background: "var(--surface-dark)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-card)", textAlign: "left", marginBottom: "28px" }}>
        {[
          { label: "Experience", value: `${pkg.name} · ${pkg.duration}` },
          { label: "City",       value: booking.city },
          { label: "Location",   value: booking.address },
          { label: "Date",       value: booking.dateLabel },
          { label: "Time",       value: booking.time },
          { label: "Price",      value: pkg.price },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 400, color: "var(--pure-white)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
          </div>
        ))}
      </div>

      <Link href="/" className="btn-tesla-secondary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
        Back to Home
      </Link>
    </div>
  );
}
