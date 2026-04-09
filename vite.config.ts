import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/buyers': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/products': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    },
  },
})

