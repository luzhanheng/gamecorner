/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#6366f1',
        'game-secondary': '#8b5cf6',
        'game-accent': '#ec4899',
      },
      fontFamily: {
        'game': ['Press Start 2P', 'cursive'],
      }
    },
  },
  plugins: [],
}