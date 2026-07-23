import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // LAVI core palette — named tokens, not generic shadcn defaults.
        // Values come from CSS variables in globals.css (mirrored, with
        // hex references, in src/config/business.ts) rather than being
        // hardcoded here, so re-skinning a client's brand colors is a
        // one-place edit instead of a hunt through component classes.
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)", // primary near-black background
          elevated: "rgb(var(--color-ink-elevated) / <alpha-value>)", // cards, panels, raised surfaces
          border: "rgb(var(--color-ink-border) / <alpha-value>)", // hairline borders on dark surfaces
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold) / <alpha-value>)", // muted brass gold — primary accent
          bright: "rgb(var(--color-gold-bright) / <alpha-value>)", // hover / active states
          dim: "rgb(var(--color-gold-dim) / <alpha-value>)", // subdued gold for borders/dividers on light
        },
        ivory: {
          DEFAULT: "rgb(var(--color-ivory) / <alpha-value>)", // warm off-white background / text on dark
          dim: "rgb(var(--color-ivory-dim) / <alpha-value>)", // secondary text on dark surfaces
          muted: "rgb(var(--color-ivory-muted) / <alpha-value>)", // tertiary text on light surfaces
        },

        // Semantic aliases consumed by shadcn/ui primitives.
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // Display: expressive serif for headlines, tracked-out uppercase —
        // evokes engraved brass signage. Used with restraint.
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        // Body: neutral grotesk for readability and UI chrome.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
        wide: "0.08em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
