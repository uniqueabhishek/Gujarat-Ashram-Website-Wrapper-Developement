/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ashram color system (original)
        ashram: {
          amber: '#D97706',
          sand: '#FDF6E3',
          stone: '#44403C',
          clay: '#78350F',
          green: '#3F6212',
        },
        // Alternative format for ashram colors
        'ashram-sand': '#FFF9F0',
        'ashram-amber': '#F59E0B',
        'ashram-clay': '#78350F',
        'ashram-stone': '#57534E',
        'ashram-green': '#059669',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
