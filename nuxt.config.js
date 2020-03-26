const URL = require('url').URL
let config = require('config')
config.basePath = new URL(config.publicUrl + '/').pathname

if (process.env.NODE_ENV === 'production') {
  const nuxtConfigInject = require('@koumoul/nuxt-config-inject')
  if (process.argv.slice(-1)[0] === 'build') config = nuxtConfigInject.prepare(config)
  else nuxtConfigInject.replace(config)
}

module.exports = {
  mode: 'spa',
  srcDir: 'public/',
  build: {
    publicPath: config.publicUrl + '/_nuxt/'
  },
  loading: { color: '#1e88e5' }, // Customize the progress bar color
  plugins: [
    { src: '~plugins/session', ssr: false },
    { src: '~plugins/iframe-resize', ssr: false }
  ],
  router: {
    base: config.basePath
  },
  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],
  axios: {
    browserBaseURL: config.basePath,
    baseURL: config.publicUrl
  },
  devModules: ['@nuxtjs/vuetify'],
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#42A5F5', // colors.blue.lighten1,
          accent: '#FF9800' // colors.orange.base
        }
      }
    }
  },
  env: {
    publicUrl: config.publicUrl,
    directoryUrl: config.directoryUrl,
    notifyUrl: config.notifyUrl
  },
  head: {
    title: 'Sauvegardes',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'application', name: 'application-name', content: 'backup' },
      { hid: 'description', name: 'description', content: 'Gestionnaire de sauvegardes' },
      { hid: 'robots', name: 'robots', content: 'noindex' }
    ]
  }
}
