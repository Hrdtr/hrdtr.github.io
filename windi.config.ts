import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      scale: {
        80: '0.8'
      }
    }
  }
})
