import runtimeConfig from './nuxt.runtimeConfig.js'

export default {
  buildModules: ['@nuxt/typescript-build', '@nuxt/postcss8'],

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s | Stella by Blackbull International',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      {
        name: 'robots',
        content: 'noindex,nofollow',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700',
      },
    ],
    script: [{ src: `https://polyfill.io/v3/polyfill.min.js?features=es5%2Ces6`, body: true }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/node_modules/vue-multiselect/dist/vue-multiselect.min.css', '~/assets/scss/tailwind.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/toast-notifications.client' },
    { src: '~/plugins/bootstrap' },
    { src: '~/plugins/global-components' },
    { src: '~/plugins/cookies' },
    { src: '~/plugins/apollo' },
    { src: '~/plugins/global-components.client' },
    { src: '~/plugins/vee-validate.client' },
    { src: '~/plugins/event-bus.client' },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [['@nuxtjs/pwa', { meta: false }], '@nuxtjs/sentry'],

  ...runtimeConfig,

  pwa: {
    workbox: {
      runtimeCaching: [
        // cache google fonts
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
        },
        {
          urlPattern: 'https://fonts.gstatic.com/.*',
          handler: 'cacheFirst',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] },
            cacheExpiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365,
              maxEntries: 30,
            },
          },
        },
      ],
    },
  },

  manifest: {
    name: 'STELLA | Blackbull International',
    lang: 'en',
    short_name: 'stella',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f2f2',
    theme_color: '#2968AA',
  },

  sentry: {
    dsn: 'https://6e9aaf0ffd67465287f0a3a49c7fb267@sentry.io/1856471',
    publishRelease: true,
    ignoreErrors: ['GraphQL error: You are not authorized to access'],
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      })

      if (isDev && isClient) {
        config.output.globalObject = 'this'
      }
    },
  },
}
