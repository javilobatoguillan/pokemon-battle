/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'poke-green-light': '#E6F4EA',
        'poke-green': '#6FBF73',
        'poke-green-dark': '#2E7D32',
        'poke-green-darker': '#1B5E20',
        'poke-yellow': '#C8B400',
        'poke-red': '#B22222',
        'poke-gray': '#D1D5DB',
      },
      fontFamily: {
        'poke': ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'poke': '4px 4px 0 #1B5E20',
      },
    },
  },
  plugins: [],
}
