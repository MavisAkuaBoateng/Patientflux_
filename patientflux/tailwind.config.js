/**** TailwindCSS Config ****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          bg: "#F7FAFC",
          primary: "#1A73E8",
          accent: "#10B981",
          danger: "#EF4444",
          muted: "#6B7280"
        }
      }
    },
  },
  plugins: [],
};