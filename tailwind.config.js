/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Carvalho Group — paleta oficial
        background: "#16171B",
        foreground: "#efeae0",

        // Ossidiana (fundos escuros)
        obsidiana: {
          DEFAULT: "#16171B",
          50:  "#f5f6f8",
          100: "#dcdede",
          200: "#b3b7bd",
          300: "#8a919a",
          400: "#616a76",
          500: "#3d4552",
          600: "#262d37",
          700: "#1a2028",
          800: "#12171d",
          900: "#0a0e14",
          950: "#05070a",
        },

        // Tinta (superfícies/inputs)
        tinta: {
          DEFAULT: "#191A1E",
          50:  "#f4f5f7",
          100: "#e8eaf0",
          200: "#d1d5e0",
          300: "#a3abbf",
          400: "#76819e",
          500: "#4e5870",
          600: "#353c52",
          700: "#232a3d",
          800: "#171c2c",
          900: "#0f121e",
          950: "#070910",
        },

        // Areia (cards, fundos claros)
        areia: {
          DEFAULT: "#e6dfd2",
          50:  "#fdfcfa",
          100: "#faf7f1",
          200: "#f2ecdc",
          300: "#e9dcc3",
          400: "#dfcaa9",
          500: "#d4b88f",
          600: "#c5a378",
          700: "#aa8761",
          800: "#8a6c50",
          900: "#705843",
          950: "#3e3022",
        },

        // Linha (bordas)
        linha: {
          DEFAULT: "#cfc6b4",
          50:  "#fdfcf9",
          100: "#faf7f0",
          200: "#f2eadc",
          300: "#e9dcc3",
          400: "#dfcaa9",
          500: "#d4b88f",
          600: "#c5a378",
          700: "#aa8761",
          800: "#8a6c50",
          900: "#705843",
          950: "#3e3022",
        },

        // Mineral & Bronze
        mineral: "#c2b293",
        bronze:  "#7e6e52",
        cinza:   "#86837d",

        // Acentos
        ocre:    "#b08a3e",
        verde:   "#4f6b52",
        vinho:   "#9e4a3e",

        // Compatibilidade shadcn + legacy
        muted:    { DEFAULT: "#cfc6b4", foreground: "#86837d" },
        accent:   { DEFAULT: "#c2b293", foreground: "#16171b" },
        destructive: { DEFAULT: "#9e4a3e", foreground: "#efeae0" },
        border:   "#cfc6b4",
        input:    "#cfc6b4",
        ring:     "#cfc6b4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
