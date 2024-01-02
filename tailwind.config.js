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
                blueGray: '#87ABBF',
                darkBlue: '#0f3564',
                brightGreen: '#4BCB67',
                brightRed: '#e00820',
                lightRed: '#FF6865',
                tinBlue: '#214559',
                lightPink: '#FFCCCB',
                eerieBlack: '#363940',
                gray80: '#cccccc',
                aliceBlue: '#F6F7F9',
                manatee: '#8e9099',
                primary: '#BA113C',
                highlight: '#E03F58',
                quartz: '#E1E1E6',
                limeGreen: '#219653',
                herringSilver: '#C4C5CC',
                flamingo: '#EB5757',
                dodgerBlue: '#2F80ED',

                //deprecated
                yellow: '#BA113C',
                emporixGold: '#FFA800',
                
            },
        },
    },
    plugins: [require('tailwindcss-font-inter')],
}
