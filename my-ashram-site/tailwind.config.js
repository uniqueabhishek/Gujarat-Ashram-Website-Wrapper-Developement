/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ashram: {
          amber: '#D97706', // Primary accent
          sand: '#FDF6E3', // Background warm
          stone: '#44403C', // Text primary
          clay: '#78350F', // Text secondary / Headers
          green: '#3F6212', // Nature accents
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
};
