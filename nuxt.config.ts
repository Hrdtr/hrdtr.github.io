import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['nuxt-windicss', '@pinia/nuxt', '@vueuse/nuxt'],
  windicss: {
    analyze: true
  },
  css: ['virtual:windi.css', 'virtual:windi-devtools']
})
