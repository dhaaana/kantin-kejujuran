const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
      },
      keyframes: {
        wiggle: {
          '0%': {
            transform: 'scale(0.95)',
          },
          '40%': {
            transform: 'scale(1.02)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        wiggle: 'wiggle 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
