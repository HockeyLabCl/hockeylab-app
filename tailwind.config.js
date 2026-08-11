/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rink: {
          900: "#05080D",
          700: "#12161D",
          500: "#232A35",
          100: "#EEF3E9",
        },
        turf: {
          500: "#82C341",
          700: "#5A8A28",
        },
        alert: {
          amber: "#C9832A",
          red: "#B84A3E",
        },
      },
      fontFamily: {
        display: ["'Anton'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
