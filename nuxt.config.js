import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/ui', '@vueuse/nuxt'],
  devtools: { enabled: true },
  css: [join(currentDir, './app/assets/css/main.css')],
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'NuxtCommonLayer',
      appLocale: process.env.APP_LOCALE || 'en',
      appCurrency: process.env.APP_CURRENCY || 'USD',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: true,
      autoInit: process.env.NODE_ENV === 'development',
    },
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
    ],
    lazy: true,
    defaultLocale: process.env.APP_LOCALE || 'en',
  },
})
