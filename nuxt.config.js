// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'NuxtCommonLayer',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      appLocale: process.env.APP_LOCALE || 'en',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'es', file: 'es.json' },
    ],
    lazy: true,
    defaultLocale: process.env.APP_LOCALE || 'en',
  },
})
