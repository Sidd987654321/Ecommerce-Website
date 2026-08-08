/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12130f",
        charcoal: "#1c1d18",
        panel: "#22231d",
        line: "#33342b",
        bone: "#eae6da",
        muted: "#9b9788",
        rust: "#b5673a",
        rustLight: "#d68a5c",
        sage: "#6b7a5e",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
