/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "380px",
      },
      colors: {
        brand: {
          bg: "#08090B",
          elevated: "#111317",
          secondary: "#191C21",
          hover: "#20242B",
          border: "#292D34",
          subtle: "#22262E",
          red: "#D71920",
          redHover: "#F1262D",
          redDark: "#9E0E14",
          redGlow: "rgba(215, 25, 32, 0.35)",
          chrome: "#E2E8F0",
          graphite: "#94A3B8",
          text: "#F5F5F5",
          muted: "#A4A8B0",
          dim: "#64748B",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "var(--font-oswald)", "sans-serif"],
        display: ["var(--font-heading)", "var(--font-oswald)", "sans-serif"],
        body: ["var(--font-body)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-body)", "var(--font-inter)", "system-ui", "sans-serif"],
        oswald: ["var(--font-oswald)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        teko: ["var(--font-teko)", "sans-serif"],
        opensans: ["var(--font-open-sans)", "sans-serif"],
      },
      boxShadow: {
        "glow-red": "0 0 25px rgba(215, 25, 32, 0.45)",
        "glow-subtle": "0 0 15px rgba(215, 25, 32, 0.2)",
        "metallic": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.8)",
      },
      backgroundImage: {
        "carbon-pattern": "radial-gradient(#1e222a 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
