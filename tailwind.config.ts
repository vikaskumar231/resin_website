import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: "#0F3831",
          teal: "#1A535C",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          roseGold: "#B76E79",
          sand: "#F7F3EE",
          ivory: "#FFFDF9",
          charcoal: "#1E232A",
          terracotta: "#C86D51",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        devanagari: ["var(--font-rozha)", "serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 56, 49, 0.06)",
        glow: "0 0 25px rgba(212, 175, 55, 0.3)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;

