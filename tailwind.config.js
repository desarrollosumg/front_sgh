/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6482AD',
        secondary: '#7FA1C3',
        accent: '#E2DAD6',
        light: '#F5EDED',
      },
    },
  },
  plugins: [],
}

