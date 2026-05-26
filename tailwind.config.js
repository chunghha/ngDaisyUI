import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
    fontFamily: {
      inter: ['inter', 'sans-serif'],
      poppins: ['poppins', 'serif'],
      'fira-mono': ['fira-mono'],
    },
  },
  plugins: [typography],
}
