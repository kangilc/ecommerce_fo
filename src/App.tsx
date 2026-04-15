import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useSseListener } from './hooks/useSseListener';
import { useState, useEffect } from 'react';
import { forceLogout } from './api/client';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import BuyerListPage from './pages/Buyer/BuyerListPage';
import BuyerDetailPage from './pages/Buyer/BuyerDetailPage';
import BuyerEditPage from './pages/Buyer/BuyerEditPage';
import ProductListPage from './pages/Product/ProductListPage';
import ProductDetailPage from './pages/Product/ProductDetailPage';
import ProductRegisterPage from './pages/Product/ProductRegisterPage';
import ProductEditPage from './pages/Product/ProductEditPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('refresh_token'));
  const [isSessionReady, setIsSessionReady] = useState(!localStorage.getItem('refresh_token'));

  useEffect(() => {
    // 새로고침 시 로컬 스토리지에 refresh_token은 있고 메모리 accessToken은 날아간 상태라면
    // 제품 리스트 등의 API가 401/302를 맞기 전에 미리 1회 복구합니다.
    if (localStorage.getItem('refresh_token')) {
      import('./api/client').then(({ restoreSession }) => {
        restoreSession().finally(() => {
          setIsSessionReady(true);
        });
      });
    }

    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('refresh_token'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  // 앱 실행 시 SSE 리스너 마운트: 로그인 상태이고 토큰 복구가 끝났을 때 커넥션
  useSseListener(isLoggedIn && isSessionReady);

  const handleLogoutClick = async () => {
    try {
      // 서버에 로그아웃을 알려 Kafka 이벤트를 발생시키고 다른 세션에 브로드캐스팅하게 함
      await import('./api/auth').then(({ logout }) => logout());
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      forceLogout();
    }
  };

  return (
    <Router>
      <nav style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none', fontWeight: 'bold' }}>Store</Link>
        <Link to="/products" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Admin: Products</Link>
        <Link to="/buyers" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Admin: Buyers</Link>
        {isLoggedIn ? (
          <a onClick={handleLogoutClick} style={{ color: 'var(--text-h)', textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Logout</a>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Join Us</Link>
          </>
        )}
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* 권한이 필요한 보호된 라우트 구역 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/buyers" element={<BuyerListPage />} />
            <Route path="/buyers/:id" element={<BuyerDetailPage />} />
            <Route path="/buyers/:id/edit" element={<BuyerEditPage />} />
            
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/new" element={<ProductRegisterPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<ProductEditPage />} />
          </Route>
        </Routes>
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </Router>
  );
}

export default App;
