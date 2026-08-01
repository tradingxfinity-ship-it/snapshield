import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563EB",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        navy: "#0F172A",
        mist: "#F8FAFC",
        electric: "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        premium: "0 20px 60px -20px rgba(37, 99, 235, 0.25)",
        soft: "0 12px 40px -12px rgba(15, 23, 42, 0.12)",
        glow: "0 0 60px -10px rgba(59, 130, 246, 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60a5fa 100%)",
        "mesh": "radial-gradient(at 20% 20%, rgba(37,99,235,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(59,130,246,0.10) 0px, transparent 50%), radial-gradient(at 100% 60%, rgba(96,165,250,0.08) 0px, transparent 50%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(1.5deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin-slow 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
