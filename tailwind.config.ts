import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f4ff",
          100: "#e2e5ff",
          200: "#c4c8ff",
          300: "#9da3ff",
          400: "#7a82ff",
          500: "#4f57ff",
          600: "#3c41db",
          700: "#2f33aa",
          800: "#24287f",
          900: "#1f2264"
        },
        legal: {
          background: "#020617",
          surface: "#020617",
          surfaceElevated: "#030712",
          border: "#1e293b",
          accent: "#38bdf8",
          danger: "#f97373",
          success: "#22c55e",
          warning: "#facc15"
        }
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

