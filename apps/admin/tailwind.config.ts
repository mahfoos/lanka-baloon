import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Terracotta / brick red — the Sri Lanka Balloon brand colour
        // (sampled from the logo banner and website header).
        brand: {
          950: "#3a120a",
          900: "#571c10",
          800: "#742616",
          700: "#91311c",
          600: "#ad4126",
          500: "#c25a40",
          400: "#d07a64",
          100: "#f4dbd2",
          50: "#fbf0ec",
        },
        // Sri Lanka green — the island silhouette in the logo.
        accent: {
          600: "#1f4d2b",
          500: "#2c6b3c",
          400: "#3e8a51",
          300: "#6aa97a",
          200: "#a3cbac",
          100: "#d6e8d9",
        },
        paper: "#faf5f1",
        ink: "#2a1a14",
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(58,18,10,.05), 0 4px 16px rgba(58,18,10,.08)",
      },
    },
  },
  plugins: [],
};
export default config;
