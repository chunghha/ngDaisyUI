/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
    fontFamily: {
      inter: ['inter', 'sans-serif'],
      poppins: ['poppins', 'serif'],
      'fira-mono': ['fira-mono'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
