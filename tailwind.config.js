/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        youtube: {
          red: "#FF0000",
          dark: "#0f0f0f",
          light: "#f1f1f1",
          cardDark: "#1f1f1f",
          hoverDark: "#272727",
        },
      },
    },
  },
  plugins: [],
};
