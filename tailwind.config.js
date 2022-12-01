const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './helpers/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  important: 'body', // todo: remove this option, when default margin on input fields is removed
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin 0.5s linear infinite',
      },
      colors: {
        // amber: colors.amber,
        // emerald: colors.emerald,
        // orange: colors.orange,
        blue: colors.sky,
        // transparent: 'transparent',
      },
    },
  },
  variants: {
    extend: {
      ringWidth: ['group-hover', 'hover'],
    },
  },
  plugins: [],
}
