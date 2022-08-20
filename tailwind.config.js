/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        move: {
          '0%': { transform: 'translate(0px,0px)' },
          '100%': { transform: 'translate(0px, -80%)' }
        },
        move2: {
          '0%': { transform: 'translate(0px,-80%)' },
          '100%': { transform: 'translate(0px, 0px)' }
        }
      },
      fontFamily: {
        fujimaru: ["Fujimaru"]
      },
    },
  },
  plugins: [],
}
