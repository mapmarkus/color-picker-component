const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  mode: "jit",
  purge: [
    "index.html",
    "src/**/*.{jsx,js}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--main-font)", ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
