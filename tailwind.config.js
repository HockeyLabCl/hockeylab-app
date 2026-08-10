/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rink: {
          900: "#0B2B26",
          700: "#134E4A",
          500: "#1F7A6C",
          100: "#E7F3F0",
        },
        turf: {
          500: "#3FA796",
        },
        alert: {
          amber: "#C9832A",
          red: "#B84A3E",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
