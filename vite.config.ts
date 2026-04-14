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
        '/api/orders': {
          target: env.VITE_API_ORDERS_URL || 'http://localhost:8081', // 주문 서버 API 포트 (임의 8081)
          changeOrigin: true,
          // configure: (proxy) => {
          //   proxy.on('proxyReq', (proxyReq, req) => {
          //     console.log('[Vite Proxy] 백엔드로 전송하는 요청:', req.method, req.url);
          //     console.log('[Vite Proxy] 백엔드로 전송되는 헤더 목록:', proxyReq.getHeaders());
          //   });
          //   proxy.on('proxyRes', (proxyRes, req) => {
          //     console.log('[Vite Proxy] 백엔드에서 받은 응답 코드:', proxyRes.statusCode, req.url);
          //     if (proxyRes.statusCode === 302 || proxyRes.statusCode === 301) {
          //       console.log('[Vite Proxy] 🚨 리다이렉트 발생! Location:', proxyRes.headers['location']);
          //     }
          //   });
          // }
        },
        '/api/notifications': {
          target: env.VITE_API_NOTIFICATIONS_URL || 'http://localhost:8084', // 실제 알림(SSE) 서버 포트에 맞춰 수정해주세요 (기본 8084로 임시 할당)
          changeOrigin: true,
        },
      },
    },
  }
})

