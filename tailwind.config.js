/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bricks: {
          yellow: '#fbbf24',
          dark: '#1a1a1a',
          green: '#10b981',
          purple: '#a855f7',
        },
      },
    },
  },
  plugins: [],
};