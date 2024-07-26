/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const forms = require('@tailwindcss/forms');

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const lineClamp = require("@tailwindcss/line-clamp");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        serif: ['ui-serif', 'Georgia'],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        neon_beer: {
          '0%': {
            background: '#fdc300',
            boxShadow:
              '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300, 0 0 15px #fdc300, 0 0 20px #fdc300, 0 0 25px #fdc300, 0 0 230px #fdc300',
          },
          '50%': {
            background: '#fdc300',
            boxShadow:
              '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300, 0 0 15px #fdc300, 0 0 20px #fdc300, 0 0 25px #fdc300, 0 0 30px #fdc300',
          },
          '100%': {
            background: '#fdc300',
            boxShadow:
              '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300, 0 0 15px #fdc300, 0 0 20px #fdc300, 0 0 25px #fdc300, 0 0 230px #fdc300',
          },
        },
        bubbles_beer: {
          '0%': {
            bottom: 0,
            background: '#fdc300',
            boxShadow: '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300',
          },
          '50%': {
            bottom: '50%',
            background: '#fdc300',
            boxShadow: '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300',
            opacity: 0.9,
          },
          '100%': {
            bottom: '100%',
            background: '#fdc300',
            boxShadow: '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300',
            opacity: 0,
          },
        },
        bubble_strech: {
          '0%': {
            transform: 'scaleY(1) scaleX(1)',
          },
          '20%': {
            transform: 'scaleY(1.05) scaleX(0.98)',
          },
          '40%': {
            transform: 'scaleY(0.98) scaleX(1.05)',
          },
          '60%': {
            transform: 'scaleY(1.04) scaleX(1.02)',
          },
          '80%': {
            transform: 'scaleY(1.1) scaleX(0.98)',
          },
          '97%': {
            transform: 'scaleY(1) scaleX(1)',
          },
        },
        bubbles: {
          '0%': {
            opacity: 0,
            background: '#fdc300',
            boxShadow: '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300',
            transform: `scaleY(1) scaleX(1) translateX(${Math.floor(
              Math.random() * 101,
            )}px)`,
          },
          '20%': {
            transform: `scaleY(1.05) scaleX(0.95) translateX(${Math.floor(
              Math.random() * 101,
            )}px)`,
          },
          '40%': {
            transform: `scaleY(0.93) scaleX(1.05) translateX(${Math.floor(
              Math.random() * 101,
            )}px)`,
          },
          '50%': {
            background: '#fdc300',
            boxShadow: '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300',
            opacity: 0.9,
          },
          '60%': {
            transform: `scaleY(1.08) scaleX(0.98) translateX(${Math.floor(
              Math.random() * 101,
            )}px)`,
          },
          '80%': {
            transform: `scaleY(0.98) scaleX(1.04) translateX(${Math.floor(
              Math.random() * 101,
            )}px)`,
          },
          '100%': {
            transform: `scaleY(1) scaleX(1) translateX(${Math.floor(
              Math.random() * 101,
            )}px)`,
            bottom: '100%',
            background: '#fdc300',
            boxShadow: '0 0 0px #fdc300, 0 0 5px #fdc300, 0 0 10px #fdc300',
            opacity: 0,
          },
        },
      },
      animation: {
        wiggle: 'wiggle 300ms ease-in-out',
        neon_beer: 'neon_beer 3s infinite ease-in-out',
        bubbles_beer: 'bubbles_beer 9s infinite linear',
        bubble_strech: 'bubble_strech 3s infinite ease-in-out',
        bubbles: 'bubbles 5s infinite linear',
        spin_slow: 'spin 5s linear infinite',
        ping_slow: 'ping 5s cubic-bezier(1, 1, 0.2, 1) infinite',
      },
    },
    colors: {
      cerv: {
        titlesec: '#fef5ed',
        titlehigh: '#a87a12',
        cream: '#fff5ed',
        coffee: '#382818',
        coal: '#242b27',
        banana: '#f09b08',
        brown: '#bf922b',
      },
      beer: {
        dark: '#432a14',
        blonde: '#f09b08',
        draft: '#90470b',
        softBlonde: '#f9d56e',
        softBlondeBubble: '#f1d273',
        softFoam: '#fce8ae',
        softerFoam: '#f7f7f7',
        foam: '#fefefe',
        gold: '#EE9900',
        darkGold: '#CA8200',
      },
      bear: {
        dark: '#502600',
        light: '#a87a12',
        blonde: '#edb640',
        alvine: '#ffd37c',
      },
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      blue: colors.blue,
      green: colors.green,
      pink: colors.pink,
      emerald: colors.emerald,
      teal: colors.teal,
      sky: colors.sky,
    },
  },
  variants: {
    border: ['hover'],
    borderColor: ['hover'],
  },
  plugins: [forms],
  // plugins: [forms, lineClamp],
};
