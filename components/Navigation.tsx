"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Performance", href: "#performance" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reserve", href: "#book" },
];

/* Tesla logo SVG — "T" wordmark */
function TeslaLogo() {
  return (
    <svg
      viewBox="0 0 150 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-auto"
      aria-label="Cybertruck"
    >
      <text
        x="0"
        y="14"
        fontFamily="Manrope, sans-serif"
        fontWeight="700"
        fontSize="14"
        letterSpacing="4"
        fill="currentColor"
        textAnchor="start"
      >
        CYBERTRUCK
      </text>
    </svg>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled
    ? "rgba(13,13,15,0.82)"
    : "transparent";
  const navBackdrop = scrolled ? "blur(20px)" : "none";
  const navBorder = scrolled
    ? "1px solid rgba(255,255,255,0.07)"
    : "1px solid transparent";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "56px",
        background: navBg,
        backdropFilter: navBackdrop,
        WebkitBackdropFilter: navBackdrop,
        borderBottom: navBorder,
        transition: "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: "var(--pure-white)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TeslaLogo />
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "var(--subtle-gray)",
                textDecoration: "none",
                transition: "color 0.15s ease",
                letterSpacing: "0",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--pure-white)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--subtle-gray)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="#book"
            className="btn-tesla-accent hidden-mobile"
            style={{ height: "36px", padding: "0 20px", fontSize: "0.8125rem" }}
          >
            Order Now
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              flexDirection: "column",
              gap: "5px",
            }}
            className="hamburger"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "1.5px",
                  background: "var(--pure-white)",
                  borderRadius: "1px",
                  transition: "all 0.25s ease",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translate(4.5px, 4.5px)"
                      : menuOpen && i === 2
                      ? "rotate(-45deg) translate(4.5px, -4.5px)"
                      : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? "300px" : "0",
          transition: "max-height 0.35s ease",
          background: "rgba(13,13,15,0.96)",
          backdropFilter: "blur(20px)",
          borderTop: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div style={{ padding: "8px 24px 20px" }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 400,
                color: "var(--subtle-gray)",
                textDecoration: "none",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transition: "color 0.15s ease",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#book"
            className="btn-tesla-accent"
            style={{ marginTop: "16px", width: "100%", justifyContent: "center" }}
            onClick={() => setMenuOpen(false)}
          >
            Order Now
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
