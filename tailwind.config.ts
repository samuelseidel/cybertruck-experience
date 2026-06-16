import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-orbitron)", "monospace"],
        body: ["var(--font-barlow)", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "sans-serif"],
      },
      colors: {
        steel: {
          50: "#f0f2f4",
          100: "#d4d9e0",
          200: "#b0bbc6",
          300: "#8a939e",
          400: "#6a7480",
          500: "#4a5460",
          600: "#323b44",
          700: "#1e252c",
          800: "#131920",
          900: "#0a0e12",
        },
        electric: {
          DEFAULT: "#00d4ff",
          dim: "rgba(0,212,255,0.15)",
          glow: "rgba(0,212,255,0.4)",
        },
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "screen-2": "200vh",
      },
      fontSize: {
        "10xl": ["9rem", { lineHeight: "1" }],
        "11xl": ["11rem", { lineHeight: "1" }],
        "12xl": ["13rem", { lineHeight: "1" }],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "line-grow": "lineGrow 1.2s ease forwards",
        "flicker": "flicker 3s ease-in-out infinite",
        "scan": "scan 8s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        lineGrow: {
          "0%": { scaleX: "0" },
          "100%": { scaleX: "1" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      clipPath: {
        "angular": "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
        "angular-r": "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
