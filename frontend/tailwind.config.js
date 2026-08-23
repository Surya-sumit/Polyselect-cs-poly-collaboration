/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EEF1EC",
        surface: "#F8FAF7",
        ink: "#152420",
        inkfaint: "#4B5A54",
        line: "#C7D1C9",
        teal: {
          DEFAULT: "#146356",
          dark: "#0E4A41",
          light: "#1D8A78",
        },
        amber: {
          DEFAULT: "#C97A2B",
          light: "#E4A45A",
        },
        danger: "#B4432F",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm2: "4px",
      },
    },
  },
  plugins: [],
};
