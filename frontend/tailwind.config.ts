import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        bubblegum: "#FF6B9D",
        lemon: "#FFE066",
        /** Do not use name `sky` — it replaces Tailwind’s full sky-* palette. */
        brandSky: "#4DCCFF",
        mint: "#6EEB83",
        grape: "#B388FF",
        coral: "#FF7F50",
        cream: "#FFF8F0",
      },
      boxShadow: {
        soft: "0 8px 32px rgba(99, 102, 241, 0.15)",
        card: "0 12px 40px rgba(0, 0, 0, 0.08)",
        glow: "0 0 24px rgba(255, 215, 0, 0.6)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
