/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        'demoCorporateFont': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        bgWhite: '#F7F8F8', // Sign Up button
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
        eerieBlack: '#1F1F1F',
        gray80: '#cccccc',
        aliceBlue: '#F6F7F9',
        manatee: '#8e9099',
        yellow: '#FAC420',
        quartz: '#E1E1E6',
        limeGreen: '#219653',
        herringSilver: '#C4C5CC',
        flamingo: '#EB5757',
        dodgerBlue: '#2F80ED', // link-color
        'titleBlack': '#000000',
        'titleRed': '#FF0000',
        'titleBlue': '#0000FF',
        'titleGreen': '#00FF00',
        'titleYellow': '#FFFF00',
        'titleOrange': '#FF6D0A',
        'titlePurple': '#AC0AFF',

        demoTopNavColor: '#FFFFFF',
        demoMainNavRightColor: '#ffffff',
        demoMainNavLeftColor: '#f2f5f8',
        demoActionColor: '#eb0000', // company main accent color (primary-buttons, Highlights, ...)
        demoSecondaryDimmed: '#C60000', // company-accent-bright-dimmed (navbar top)
        demoHeadlines: '#C60000', // company-accent-dark (fonts/headlines/logo-background)
        demoFontColor: '#323434', // company-accent-dark-dimmed (body text)
        demoGrayBrightest: '#FFFFFF', // footer/form/... background etc.
        demoGray: '#FCFCFD', //'#D5DCE7', // Borders
        demoGrayDarker: '#F3F5F8', // Darker borders
        demoGrayDarkest: '#323434', // Gray texts
        demoAlerting: '#C51718', // Alerting accents like error borders or offer badges
      },
    },
  },
  plugins: [
    require('tailwindcss-font-inter'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')],
}
