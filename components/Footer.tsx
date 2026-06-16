"use client";

const footerLinks = {
  Vehicles: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Semi"],
  Energy: ["Solar Panels", "Solar Roof", "Powerwall", "Powerpack", "Megapack"],
  Charging: ["Charging", "Supercharger", "Home Charging", "Destination Charging"],
  Discover: ["About Tesla", "Careers", "Press", "Investor Relations", "Contact"],
  Legal: ["Privacy & Legal", "Vehicle Privacy Notice", "Contact", "News", "Locations"],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--onyx)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Main link grid */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "48px 24px 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "32px",
          }}
        >
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--pure-white)",
                  marginBottom: "12px",
                  letterSpacing: "0",
                }}
              >
                {category}
              </p>
              <ul style={{ listStyle: "none" }}>
                {links.map((link) => (
                  <li key={link} style={{ marginBottom: "8px" }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.8125rem",
                        fontWeight: 300,
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
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px",
          maxWidth: "1320px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            fontWeight: 300,
            color: "var(--steel)",
          }}
        >
          Tesla © {new Date().getFullYear()} · All Rights Reserved
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {["Privacy", "Legal", "Contact", "Careers"].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                fontWeight: 300,
                color: "var(--steel)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--pure-white)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--steel)")
              }
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
