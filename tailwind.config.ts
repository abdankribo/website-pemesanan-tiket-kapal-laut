import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003063",
        "primary-container": "#174b83",
        secondary: "#b85c00",
        "secondary-container": "#ffdbb8",
        surface: "#f8f9fb",
        "surface-container-low": "#f1f3f6",
        "surface-container-high": "#e1e4e8",
        "on-surface": "#191c1e",
        "on-surface-variant": "#42474d",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
