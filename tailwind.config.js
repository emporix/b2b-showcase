/** @type {import("tailwindcss").Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        bgWhite: '#F7F8F8',
        gray: '#ACAEB2',
        darkGray: '#818385',
        lightGray: '#D7DADE',
        primaryBlue: '#0380f3',
        lightBlue: '#4EA6F6',
        emporixGold: '#FFA800',
        blueGray: '#87ABBF',
        darkBlue: '#0f3564',
        brightGreen: '#4BCB67',
        brightRed: '#e00820',
        lightRed: '#FF6865',
        tinBlue: '#214559',
        lightPink: '#FFCCCB',
      },
    },
  },
  plugins: [require('tailwindcss-font-inter')],
}
