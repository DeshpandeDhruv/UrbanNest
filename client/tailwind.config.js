/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-accent': '#4F46E5' // You can change this HEX to match your theme
      }
    }
  },
  plugins: [],
}

