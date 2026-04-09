import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();

  // 로그인 여부를 판단합니다.
  // 여기서는 간단하게 로컬 스토리지의 refresh_token 존재 유무로 판단합니다.
  // 실제 운영에서는 전역 상태(Context/Zustand 등)의 인증 객체를 확인하는 패턴이 좋습니다.
  const isAuthenticated = !!localStorage.getItem('refresh_token');

  if (!isAuthenticated) {
    // 권한이 없을 경우 로그인 페이지로 리다이렉트
    // 다시 돌아올 수 있도록 현재 이동하려던 경로를 state에 저장
    alert('로그인이 필요한 서비스입니다.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 인증되었다면 자식 컴포넌트(Outlet)를 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
