export default defineNuxtConfig({
    modules: ['@nuxt/ui', '@nuxtjs/i18n'],
    css: ['~/assets/css/main.css'],
    i18n: {
        locales: [
            {code: 'en', file: 'en.json'},
            {code: 'es', file: 'es.json'}
        ],
        lazy: true,
        defaultLocale: process.env.APP_LOCALE || 'en',
    },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true}
})
