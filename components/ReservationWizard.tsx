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

// ─── Geo helpers ─────────────────────────────────────────────────────

const TOUR_COORDS: Record<string, { lat: number; lng: number }> = {
  prague:  { lat: 50.1003, lng: 14.4500 },
  brno:    { lat: 49.1951, lng: 16.6068 },
  hradec:  { lat: 50.2090, lng: 15.8327 },
  ostrava: { lat: 49.8209, lng: 18.2625 },
};

const CITY_LOOKUP: [string, string][] = [
  ["prague", "prague"], ["praha", "prague"], ["stredocesky", "prague"],
  ["kladno", "prague"], ["beroun", "prague"], ["melnik", "prague"],
  ["brno", "brno"], ["jihomoravsky", "brno"], ["znojmo", "brno"],
  ["hodonin", "brno"], ["breclav", "brno"], ["vyskov", "brno"],
  ["hradec", "hradec"], ["pardubice", "hradec"], ["liberec", "hradec"],
  ["olomouc", "hradec"], ["jicin", "hradec"], ["chrudim", "hradec"],
  ["ostrava", "ostrava"], ["opava", "ostrava"], ["karvina", "ostrava"],
  ["frydek", "ostrava"], ["havirov", "ostrava"], ["prerov", "ostrava"],
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function nearestToCoords(lat: number, lng: number): { tour: Tour; km: number } {
  let best = TOURS[0];
  let bestKm = Infinity;
  for (const tour of TOURS) {
    const c = TOUR_COORDS[tour.id];
    const km = haversineKm(lat, lng, c.lat, c.lng);
    if (km < bestKm) { bestKm = km; best = tour; }
  }
  return { tour: best, km: bestKm };
}

function nearestToText(input: string): Tour | null {
  const q = input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  if (q.length < 3) return null;
  for (const [key, tourId] of CITY_LOOKUP) {
    if (q.includes(key) || key.startsWith(q)) {
      return TOURS.find(t => t.id === tourId) ?? null;
    }
  }
  return null;
}

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
  "Find your nearest stop.",
  "Pick your time slot.",
  "Almost there.",
  "See you there.",
];

// ─── Booking state ──────────────────────────────────────────────────

const VOUCHER_RE = /^CT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

function fmtVoucher(raw: string): string {
  const chars = raw.replace(/[^A-Z0-9]/g, "").toUpperCase().slice(0, 14);
  const parts: string[] = [];
  if (chars.length >= 2)  parts.push(chars.slice(0, 2));
  if (chars.length >= 3)  parts.push(chars.slice(2, 6));
  if (chars.length >= 7)  parts.push(chars.slice(6, 10));
  if (chars.length >= 11) parts.push(chars.slice(10, 14));
  return parts.join("-");
}

interface Booking {
  cityId: string; city: string; address: string;
  dateIdx: number; dateLabel: string; dateIso: string; time: string;
  package: string;
  hasVoucher: boolean; voucherCode: string;
  firstName: string; lastName: string; email: string; phone: string;
}

function initBooking(initialCity?: string, initialDate?: string, initialTime?: string): { booking: Booking; step: number } {
  const empty: Booking = {
    cityId: "", city: "", address: "",
    dateIdx: 0, dateLabel: "", dateIso: "", time: "",
    package: "discovery",
    hasVoucher: false, voucherCode: "",
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
            {step === 0 && <LocationStep booking={booking} setBooking={setBooking} onNext={() => goStep(1)} />}
            {step === 1 && tour && <DateTimeStep tour={tour} booking={booking} setBooking={setBooking} onNext={() => goStep(2)} />}
            {step === 2 && <DetailsStep  booking={booking} setBooking={setBooking} onNext={() => goStep(3)} />}
            {step === 3 && <ConfirmedStep booking={booking} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Step 1: Location ────────────────────────────────────────────────

type LocationPhase = "input" | "detecting" | "found";

function LocationStep({ booking, setBooking, onNext }: { booking: Booking; setBooking: (b: Booking) => void; onNext: () => void }) {
  const [phase, setPhase]       = useState<LocationPhase>(() => booking.cityId ? "found" : "input");
  const [nearest, setNearest]   = useState<{ tour: Tour; km: number } | null>(() => {
    if (!booking.cityId) return null;
    const tour = TOURS.find(t => t.id === booking.cityId);
    return tour ? { tour, km: 0 } : null;
  });
  const [showAll, setShowAll]   = useState(false);
  const [query, setQuery]       = useState("");
  const [errMsg, setErrMsg]     = useState("");
  const [notFound, setNotFound] = useState(false);

  function applyTour(tour: Tour, km = 0) {
    const d = tour.dates[0];
    setBooking({ ...booking, cityId: tour.id, city: tour.city, address: tour.address, dateIdx: 0, dateLabel: d.label, dateIso: d.iso, time: "" });
    setNearest({ tour, km });
  }

  function detectGeo() {
    if (!("geolocation" in navigator)) { setErrMsg("Geolocation not supported — search below."); return; }
    setPhase("detecting");
    setErrMsg("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const result = nearestToCoords(pos.coords.latitude, pos.coords.longitude);
        applyTour(result.tour, result.km);
        setPhase("found");
      },
      () => { setErrMsg("Location access denied. Search by city below."); setPhase("input"); },
      { timeout: 8000 }
    );
  }

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    const found = nearestToText(query);
    if (found) { applyTour(found); setPhase("found"); setNotFound(false); }
    else        { setNotFound(true); }
  }

  function pickFromList(t: Tour) { applyTour(t); setPhase("found"); setShowAll(false); }

  function openSlots(t: Tour) { return t.dates.reduce((s, d) => s + d.slots.filter(sl => sl.spots > 0).length, 0); }

  const slotColor = (n: number) => n > 10 ? "rgba(100,190,100,0.75)" : n > 0 ? "rgba(255,160,50,0.75)" : "rgba(255,80,80,0.6)";

  const CityRow = ({ t, selected }: { t: Tour; selected: boolean }) => {
    const open = openSlots(t);
    return (
      <button onClick={() => pickFromList(t)} style={{
        display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px",
        background: selected ? "rgba(62,106,225,0.09)" : "rgba(255,255,255,0.04)",
        border: selected ? "1px solid rgba(62,106,225,0.35)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "var(--radius-card)", cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "2px" }}>{t.city}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{t.address}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 400, color: selected ? "rgba(62,106,225,0.85)" : "var(--subtle-gray)", marginBottom: "2px" }}>{t.range}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: slotColor(open) }}>
            {open > 0 ? `${open} slots` : "Sold out"}
          </p>
        </div>
        {selected
          ? <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "var(--tesla-blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 7h8M7 3l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        }
      </button>
    );
  };

  const Divider = ({ label }: { label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0 16px" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 300, color: "var(--steel)" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
    </div>
  );

  return (
    <div>
      <p className="tesla-label" style={{ marginBottom: "12px" }}>Step 1 of 3</p>
      <h1 className="t-heading-lg" style={{ color: "var(--pure-white)", marginBottom: "8px" }}>Find your nearest stop.</h1>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--subtle-gray)", lineHeight: 1.65, marginBottom: "36px", maxWidth: "420px" }}>
        The Cybertruck is touring the Czech Republic this summer. We&apos;ll find the closest stop to you.
      </p>

      {/* ── Detecting ─── */}
      {phase === "detecting" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 0", gap: "16px" }}>
          <style>{`@keyframes rwSpin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(62,106,225,0.2)", borderTopColor: "var(--tesla-blue)", animation: "rwSpin 0.75s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 300, color: "var(--subtle-gray)" }}>Detecting your location…</p>
        </div>
      )}

      {/* ── Input ─── */}
      {phase === "input" && (
        <>
          {errMsg && (
            <div style={{ padding: "10px 14px", marginBottom: "20px", background: "rgba(255,160,50,0.07)", border: "1px solid rgba(255,160,50,0.2)", borderRadius: "4px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(255,160,50,0.85)" }}>{errMsg}</p>
            </div>
          )}

          <button onClick={detectGeo} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", height: "52px", marginBottom: "20px",
            background: "rgba(62,106,225,0.09)", border: "1px solid rgba(62,106,225,0.28)", borderRadius: "var(--radius-card)",
            cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--tesla-blue)",
            transition: "all 0.15s ease",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Use My Location
          </button>

          <Divider label="or search by city" />

          <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Prague, Brno, Pardubice…"
              value={query}
              onChange={e => { setQuery(e.target.value); setNotFound(false); }}
              style={{
                flex: 1, height: "48px", padding: "0 16px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
                fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 300, color: "var(--pure-white)", outline: "none",
              }}
            />
            <button type="submit" style={{
              width: "48px", height: "48px", flexShrink: 0,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          {notFound && (
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(255,160,50,0.75)", marginBottom: "0" }}>
              No match — choose a city below.
            </p>
          )}

          <Divider label="or pick directly" />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {TOURS.map(t => <CityRow key={t.id} t={t} selected={false} />)}
          </div>
        </>
      )}

      {/* ── Found ─── */}
      {phase === "found" && nearest && (
        <>
          <div style={{
            padding: "20px 22px", marginBottom: "20px",
            background: "rgba(62,106,225,0.07)", border: "1px solid rgba(62,106,225,0.25)", borderRadius: "var(--radius-card)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(62,106,225,0.7)", marginBottom: "8px" }}>
                  {nearest.km > 0 ? `Nearest stop · ~${nearest.km} km away` : "Selected stop"}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "4px" }}>{nearest.tour.city}</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{nearest.tour.address}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 500, color: "rgba(62,106,225,0.85)", marginBottom: "4px" }}>{nearest.tour.range}</p>
                {(() => {
                  const open = openSlots(nearest.tour);
                  return <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: slotColor(open) }}>{open} slots open</p>;
                })()}
              </div>
            </div>
          </div>

          <button onClick={onNext} className="btn-tesla-accent" style={{ width: "100%", justifyContent: "center", height: "48px", marginBottom: "12px" }}>
            See Available Slots
          </button>

          <button
            onClick={() => setShowAll(prev => !prev)}
            style={{
              width: "100%", height: "40px",
              background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-card)",
              cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 400, color: "var(--subtle-gray)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "border-color 0.15s ease",
            }}
          >
            Choose a different city
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showAll && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              {TOURS.map(t => <CityRow key={t.id} t={t} selected={t.id === nearest.tour.id} />)}
            </div>
          )}
        </>
      )}
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

// ─── Step 3: Details + Payment ───────────────────────────────────────

function DetailsStep({ booking, setBooking, onNext }: { booking: Booking; setBooking: (b: Booking) => void; onNext: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg]   = useState("");

  const detailsOk  = !!(booking.firstName && booking.lastName && booking.email);
  const voucherOk  = booking.hasVoucher && VOUCHER_RE.test(booking.voucherCode) && detailsOk;
  const payOk      = !booking.hasVoucher && detailsOk;
  const canSubmit  = voucherOk || payOk;

  const selectedPkg = PACKAGES.find(p => p.id === booking.package) || PACKAGES[0];

  async function handlePayNow() {
    if (!payOk || loading) return;
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch("/api/booking/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else throw new Error(data.error || "Unknown error");
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

      {/* Slot summary */}
      <div style={{ padding: "14px 18px", background: "rgba(62,106,225,0.07)", border: "1px solid rgba(62,106,225,0.2)", borderRadius: "var(--radius-card)", marginBottom: "24px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(62,106,225,0.7)", marginBottom: "5px" }}>Your slot</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "2px" }}>
          {booking.city} · {booking.dateLabel} · {booking.time}
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{booking.address}</p>
      </div>

      {/* Package selection — hidden in voucher mode (duration set by voucher) */}
      {!booking.hasVoucher && (
        <>
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
        </>
      )}

      {/* ── Voucher toggle ── */}
      <button
        onClick={() => setBooking({ ...booking, hasVoucher: !booking.hasVoucher, voucherCode: "" })}
        style={{
          display: "flex", alignItems: "center", gap: "14px", width: "100%",
          padding: "16px 18px", marginBottom: booking.hasVoucher ? "12px" : "24px",
          background: booking.hasVoucher ? "rgba(62,106,225,0.08)" : "rgba(255,255,255,0.03)",
          border: booking.hasVoucher ? "1px solid rgba(62,106,225,0.35)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: "var(--radius-card)", cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
        }}
      >
        <div style={{
          flexShrink: 0, width: "22px", height: "22px", borderRadius: "4px",
          border: booking.hasVoucher ? "none" : "1.5px solid rgba(255,255,255,0.25)",
          background: booking.hasVoucher ? "var(--tesla-blue)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease",
        }}>
          {booking.hasVoucher && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--pure-white)", marginBottom: "2px" }}>
            I have a voucher
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>
            Redeem a gift voucher — session duration set by your voucher
          </p>
        </div>
      </button>

      {/* Voucher code input */}
      {booking.hasVoucher && (
        <div style={{ marginBottom: "24px" }}>
          <label style={lbl}>Voucher Code</label>
          <input
            style={{ ...inp, fontFamily: "monospace", letterSpacing: "0.12em", fontSize: "1rem",
              borderColor: booking.voucherCode && !VOUCHER_RE.test(booking.voucherCode) ? "rgba(220,80,80,0.5)" : "rgba(255,255,255,0.12)" }}
            type="text"
            placeholder="CT-XXXX-XXXX-XXXX"
            value={booking.voucherCode}
            maxLength={17}
            onChange={e => setBooking({ ...booking, voucherCode: fmtVoucher(e.target.value) })}
            onFocus={onFocus} onBlur={onBlur}
          />
          {booking.voucherCode && !VOUCHER_RE.test(booking.voucherCode) && (
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "rgba(220,80,80,0.8)", marginTop: "6px" }}>
              Format: CT-XXXX-XXXX-XXXX
            </p>
          )}
        </div>
      )}

      {/* ── Personal details ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        {([{ key: "firstName", label: "First Name", ph: "Jane" }, { key: "lastName", label: "Last Name", ph: "Smith" }] as const).map(({ key, label, ph }) => (
          <div key={key}>
            <label style={lbl}>{label}</label>
            <input style={inp} type="text" required placeholder={ph} value={booking[key]}
              onChange={e => setBooking({ ...booking, [key]: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={lbl}>Email</label>
        <input style={inp} type="email" required placeholder="you@example.com" value={booking.email}
          onChange={e => setBooking({ ...booking, email: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={lbl}>
          Phone
          <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0, marginLeft: "6px", opacity: 0.6 }}>optional</span>
        </label>
        <input style={inp} type="tel" placeholder="+420 600 000 000" value={booking.phone}
          onChange={e => setBooking({ ...booking, phone: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
      </div>

      {errMsg && (
        <div style={{ padding: "10px 14px", marginBottom: "16px", background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.25)", borderRadius: "4px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(255,100,100,0.9)" }}>{errMsg}</p>
        </div>
      )}

      {/* ── CTA ── */}
      {booking.hasVoucher ? (
        <>
          <button onClick={onNext} disabled={!voucherOk} className="btn-tesla-accent"
            style={{ width: "100%", justifyContent: "center", height: "48px", opacity: voucherOk ? 1 : 0.4, marginBottom: "12px" }}>
            Reserve with Voucher
          </button>
          <p style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
            No charge — slot is secured against your voucher code
          </p>
        </>
      ) : (
        <>
          <button onClick={handlePayNow} disabled={!payOk || loading} className="btn-tesla-accent"
            style={{ width: "100%", justifyContent: "center", height: "48px", opacity: payOk && !loading ? 1 : 0.4, gap: "8px" }}>
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
              `Pay ${selectedPkg.price} & Reserve`
            )}
          </button>
          <p style={{ textAlign: "center", marginTop: "12px", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 300, color: "var(--steel)" }}>
            Secure payment via Stripe · Fully refundable 48h before your session
          </p>
        </>
      )}
    </div>
  );
}

// ─── Step 4: Confirmed (voucher redemption path) ──────────────────────

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
        {booking.hasVoucher
          ? <>Your slot is confirmed. We&apos;ll send a reminder to <strong style={{ color: "var(--pure-white)" }}>{booking.email}</strong> before your session.</>
          : <>We&apos;ll confirm your booking at <strong style={{ color: "var(--pure-white)" }}>{booking.email}</strong> within the hour.</>
        }
      </p>

      <div style={{ padding: "20px 24px", background: "var(--surface-dark)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-card)", textAlign: "left", marginBottom: "28px" }}>
        {[
          { label: "Experience", value: booking.hasVoucher ? "Set by voucher" : `${pkg.name} · ${pkg.duration}` },
          { label: "City",       value: booking.city },
          { label: "Location",   value: booking.address },
          { label: "Date",       value: booking.dateLabel },
          { label: "Time",       value: booking.time },
          ...(booking.hasVoucher
            ? [{ label: "Voucher", value: booking.voucherCode }]
            : [{ label: "Price",   value: pkg.price }]
          ),
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8125rem", fontWeight: 300, color: "var(--subtle-gray)" }}>{label}</span>
            <span style={{ fontFamily: label === "Voucher" ? "monospace" : "var(--font-display)", fontSize: "0.8125rem", fontWeight: 400, color: "var(--pure-white)", textAlign: "right", maxWidth: "60%" }}>{value}</span>
          </div>
        ))}
      </div>

      <Link href="/" className="btn-tesla-secondary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
        Back to Home
      </Link>
    </div>
  );
}
