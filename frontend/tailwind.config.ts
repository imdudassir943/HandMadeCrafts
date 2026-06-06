import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: "#6f1d1b",
          gold: "#bb9457",
          espresso: "#432818",
          sienna: "#99582a",
          cream: "#ffe6a7",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        button: "4px",
        input: "4px",
        card: "8px",
        modal: "16px",
      },
      boxShadow: {
        warm: "0 4px 24px rgba(111,29,27,0.08)",
        "warm-hover": "0 8px 32px rgba(111,29,27,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
