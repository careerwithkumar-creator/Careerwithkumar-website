import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: {
          DEFAULT: "var(--border)",
          soft: "var(--border-soft)",
        },
        navy: {
          DEFAULT: "var(--navy)",
          2: "var(--navy-2)",
          soft: "var(--navy-soft)",
          text: "var(--navy-text)",
        },
        blue: {
          DEFAULT: "var(--blue)",
          soft: "var(--blue-soft)",
        },
        text: {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
          3: "var(--text-3)",
        },
        green: {
          DEFAULT: "var(--green)",
          soft: "var(--green-soft)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          soft: "var(--amber-soft)",
        },
        red: {
          DEFAULT: "var(--red)",
          soft: "var(--red-soft)",
        },
        purple: {
          DEFAULT: "var(--purple)",
          soft: "var(--purple-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "7px",
        md: "7px",
        lg: "8px",
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
