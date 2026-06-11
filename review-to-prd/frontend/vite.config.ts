import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Split vendor libraries into separate chunks so browsers can cache them independently
    // and the landing page doesn't need to load the entire app's JS on first visit
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue framework — changes rarely, gets cached by browser
          'vendor-vue': ['vue', 'vue-router'],
          // HTTP client
          'vendor-http': ['axios'],
        },
      },
    },
  },
})

