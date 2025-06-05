/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'inter':['Inter','san-serif'],
        'poppins':['poppins','Inter','san-serif']
      },
    },
  },
  plugins: [],
}

