// C:\Navin\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
          hover: "var(--color-primary-hover)",
        },
        // Background Colors
        bg: {
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          "surface-2": "var(--color-bg-surface-2)",
          "surface-3": "var(--color-bg-surface-3)",
        },
        // Text Colors
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        // Border Colors
        border: {
          light: "var(--color-border-light)",
          medium: "var(--color-border-medium)",
          dark: "var(--color-border-dark)",
        },
        // Accent Colors (legacy support)
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
        },
        // Legacy support
        downriver: "var(--color-downriver)",
        loblolly: "var(--color-loblolly)",
        "pickled-bluewood": "var(--color-pickled-bluewood)",
        "regent-gray": "var(--color-regent-gray)",
        // Status Colors
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "slide-in": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
