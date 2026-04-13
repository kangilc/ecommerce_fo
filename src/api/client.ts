import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Refresh Token이 HttpOnly 쿠키로 교환된다고 가정
});

// Access Token을 메모리에 보관
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// 1. 요청 인터셉터
client.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 모든 요청의 Authorization에 Bearer로 붙여서 보냄
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신 중복을 막기 위한 플래그
let isRefreshing = false;
// 재요청을 대기하는 프로미스 큐
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  setAccessToken(null);
  localStorage.removeItem('user_info');
  localStorage.removeItem('refresh_token'); // Refresh Token 삭제
  window.dispatchEvent(new Event('auth-change'));
  // 강제 로그아웃 시 로그인 페이지로 이동하는 로직 등 추가
  window.location.href = '/';
};

// 2. 응답 인터셉터
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 만약 에러 상태가 401(Unauthorized)이고, 아직 재시도하지 않은 요청이라면
    if (error.response?.status === 401 && !originalRequest._retry) {
      // /auth/refresh 자체에서 401이 나면 무한 반복에 빠지지 않도록 처리
      if (originalRequest.url?.includes('/auth/refresh')) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 갱신 중인 경우, 큐에 넣고 대기
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          handleLogout();
          return Promise.reject(new Error('No refresh token available'));
        }

        // 백엔드 Refresh API 호출 (Body에 Refresh Token 포함)
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        
        const newAccessToken = res.data.accessToken || res.data.data?.accessToken; // 백엔드 응답 구조에 맞게 수정
        const newRefreshToken = res.data.refreshToken || res.data.data?.refreshToken; // 새로 발급될 경우
        
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        processQueue(null, newAccessToken);
        
        // 새로 발급받은 토큰으로 기존 401에러 났던 요청 재실행
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout(); // 갱신 실패 (리프레시 토큰 만료 등) -> 로그아웃 처리
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 외부에서 강제 로그아웃 처리 등을 하기 위해 export
// (예: Kafka LOGOUT_SUCCESS 이벤트를 SSE로 받으면 이 함수 호출)
export const forceLogout = () => {
  handleLogout();
};

export default client;
