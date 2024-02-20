/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#E5E8E8',
      },
      fontSize: {
        'xxs': '0.75rem',
        'header': '11px',
      },
    },
  },
  plugins: [],
}
