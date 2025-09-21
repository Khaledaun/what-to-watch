import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/components/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic Gold palette
        brand: {
          gold: "#E0B15C",
          goldSoft: "#F2C879",
          navy: "#0A1220",
          navy2: "#0D162A",
          ink: "#0B0F14",
        },
        text: {
          DEFAULT: "#E6EAF1",
          muted: "#9BA8C7",
        },
        surface: {
          DEFAULT: "#0F1620",
          soft: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.10)",
        },
        accent: {
          blue: "#1E3A8A",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 14px 40px -18px rgba(0,0,0,0.55)",
        glow: "0 0 0 2px rgba(224,177,92,0.22), 0 18px 50px -20px rgba(224,177,92,0.45)",
      },
      backgroundImage: {
        "navy-spotlight":
          "radial-gradient(800px 400px at 20% 0%, rgba(224,177,92,0.10) 0%, rgba(10,18,32,0) 60%), radial-gradient(800px 400px at 80% 0%, rgba(30,58,138,0.12) 0%, rgba(10,18,32,0) 60%)",
        "grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        "swift-out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      fontFamily: {
        display: ["Inter Tight", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
