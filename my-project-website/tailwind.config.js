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
        'header-1': '10px',
        'header-2': '9px',
        'header-3': '9px',
      },
    },
  },
  plugins: [],
}
