/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        neon_beer: {
          "0%": {
            background: "#fdc300",
            boxShadow:
              "0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300, 0 0 15px #fdc300, 0 0 20px #fdc300, 0 0 25px #fdc300, 0 0 230px #fdc300",
          },
          "50%": {
            background: "#fdc300",
            boxShadow:
              "0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300, 0 0 15px #fdc300, 0 0 20px #fdc300, 0 0 25px #fdc300, 0 0 30px #fdc300",
          },
          "100%": {
            background: "#fdc300",
            boxShadow:
              "0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300, 0 0 15px #fdc300, 0 0 20px #fdc300, 0 0 25px #fdc300, 0 0 230px #fdc300",
          },
        },
      },
      animation: {
        wiggle: "wiggle 300ms ease-in-out",
        neon_beer: "neon_beer 3s infinite ease-in-out",
      },
    },
    colors: {
      beer: {
        dark: "#432a14",
        blonde: "#fdc300",
        draft: "#90470b",
      },
      bear: {
        dark: "#502600",
        light: "#a87a12",
      },
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
