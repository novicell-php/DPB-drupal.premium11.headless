import postcssConfig from '@novicell/postcss-config';

export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    prefetchLinks: true,

    head: {
      titleTemplate: '%s | Novicell',
      htmlAttrs: {
        lang: 'en',
      },

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'http-equiv="Content-Security-Policy"',
          content: "script-src 'self';",
        },
      ],
      link: [{ rel: 'preconnect', href: 'https://consent.cookiebot.com' }],
      script: [
        {
          id: 'Cookiebot',
          src: 'https://consent.cookiebot.com/uc.js',
          'data-cbid': '226ecb7b-1eba-45cf-a066-6c4a0ce13318',
          'data-framework': 'IAB',
          type: 'text/javascript',
          async: true,
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },

  components: [
    '~/components',
    '~/components/base',
    '~/components/base/form',
    '~/components/blocks',
    '~/components/factory',
    '~/components/globals',
    '~/components/modals',
    '~/components/globals/footer',
    '~/components/globals/navigation',
    '~/components/views',
  ],
  css: ['/assets/css/app.css'],

  webpack: {
    extractCSS: true,
  },

  postcss: {
    config: false,
    plugins: {
      ...postcssConfig({
        'postcss-preset-env': {
          stage: 2,
          preserve: true,
        },
      }),
    },
  },

  modules: ['@pinia/nuxt', 'nuxt-icons'],

  optimization: {
    splitChunks: {
      chunks: 'all',
      maxSize: 250000,
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10,
        },
      },
    },
  },

  compatibilityDate: '2024-09-26',
});
