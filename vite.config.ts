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
        '/api/auth': {
          target: env.VITE_API_AUTH_URL || 'http://localhost:8084',
          changeOrigin: true,
        },
        '/api/notifications': {
          target: env.VITE_API_NOTIFICATIONS_URL || 'http://localhost:8084', // 실제 알림(SSE) 서버 포트에 맞춰 수정해주세요 (기본 8084로 임시 할당)
          changeOrigin: true,
        },
      },
    },
  }
})

