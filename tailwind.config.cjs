/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary red spectrum (Red Cross brand colors)
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Main Red Cross red
          600: "#dc2626", // Deep red
          700: "#b91c1c", // Dark red
          800: "#991b1b", // Darker red
          900: "#7f1d1d", // Darkest red
        },

        // Medical/humanitarian reds
        medical: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#e11d48", // Crimson red
          600: "#be123c",
          700: "#9f1239",
          800: "#881337",
          900: "#4c0519",
        },

        // Neutral whites and grays (for balance)
        neutral: {
          50: "#ffffff", // Pure white
          100: "#f7f9fc", // Cool off-white
          200: "#eef2f7", // Light cool gray
          300: "#dbe2ec", // Soft blue-gray
          400: "#b8c2d1", // Muted blue-gray
          500: "#8a96ab", // Neutral slate
          600: "#5f6f89", // Cool dark gray
          700: "#3e4f6b", // Deep blue-gray
          800: "#22324f", // Near-navy
          900: "#011d40", // Your base color
          950: "#010f24", // Deeper night blue
        },

        // Accent colors for humanitarian themes
        accent: {
          hope: "#10b981", // Green for hope/health
          care: "#3b82f6", // Blue for care/trust
          warmth: "#f59e0b", // Amber for warmth
          urgent: "#dc2626", // Urgent red
          safe: "#059669", // Safety green
        },

        // Status colors
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
        marquee: "marquee 30s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(239, 68, 68, 0.8) 50%, rgba(185, 28, 28, 0.9) 100%)",
        "primary-gradient":
          "linear-gradient(135deg, #b91c1c, #dc2626, #ef4444)",
        "white-gradient": "linear-gradient(135deg, #ffffff, #f9fafb, #f3f4f6)",
      },

      boxShadow: {
        "red-glow": "0 0 20px rgba(239, 68, 68, 0.3)",
        "red-glow-lg": "0 0 40px rgba(239, 68, 68, 0.4)",
      },
    },
  },
  plugins: [],
};
