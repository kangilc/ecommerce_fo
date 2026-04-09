import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 mode(local, dev, qa, prd)에 맞는 .env 파일의 환경설정을 로드합니다.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/buyers': {
          target: env.VITE_API_BUYERS_URL || 'http://localhost:8081',
          changeOrigin: true,
        },
        '/api/products': {
          target: env.VITE_API_PRODUCTS_URL || 'http://localhost:8082',
          changeOrigin: true,
        },
      },
    },
  }
})

