/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#3B82F6',
        'medical-green': '#10B981',
      },
    },
  },
  plugins: [],
}
