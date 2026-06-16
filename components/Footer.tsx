"use client";

const footerLinks = {
  Experience: ["Book a Ride", "The Packages", "Gift Cards", "Corporate Events", "FAQ"],
  Locations: ["Los Angeles", "San Francisco", "Las Vegas", "New York", "Miami"],
  Safety: ["Safety Briefing", "Insurance", "Requirements", "Accessibility"],
  Company: ["About", "Press", "Careers", "Partners", "Contact"],
  Legal: ["Terms of Service", "Privacy Policy", "Refund Policy", "Cookie Policy"],
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
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pure-white)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--subtle-gray)")
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
          Cybertruck Experience © {new Date().getFullYear()} · Not affiliated with Tesla, Inc.
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {["Privacy", "Terms", "Refunds", "Contact"].map((label) => (
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
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pure-white)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--steel)")
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
