/** @type {import("tailwindcss").Config} */
module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#333333",
        bgWhite: "#F7F8F8",
        gray: "#ACAEB2",
        darkGray: "#818385",
        lightGray: "#E9E9E9",
        primaryBlue: "#0380f3",
        lightBlue: "#5F8FAA",
        emporixGold: "#FFA800",
        blueGray: "#87ABBF",
        darkBlue: "#0f3564",
        brightGreen: "#4BCB67",
        brightRed: "#e00820",
        lightRed: "#FF6865",
        tinBlue: "#214559",
        lightPink: "#FFCCCB",
        blue: "#3582D1",
        blueHover: "#365C97",
        green: "#83ca25",
        greenHover: "#598919",
        braun: "#e9e0c8",
      }
    }
  },
  plugins: [require("tailwindcss-font-inter")]
};
