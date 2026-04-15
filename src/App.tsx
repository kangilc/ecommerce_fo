import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Header from './components/Header/Header';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('refresh_token'));
  const [isSessionReady, setIsSessionReady] = useState(!localStorage.getItem('refresh_token'));

  useEffect(() => {
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

  useSseListener(isLoggedIn && isSessionReady);

  const handleLogoutClick = async () => {
    try {
      await import('./api/auth').then(({ logout }) => logout());
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      forceLogout();
    }
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogoutClick} />

      <main className="container" style={{ flex: 1, padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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

      <footer style={{ 
        backgroundColor: '#fff', 
        borderTop: '1px solid var(--border-light)', 
        padding: '40px 0',
        marginTop: '40px'
      }}>
        <div className="container" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          <p>© 2026 Javaf. All rights reserved.</p>
          <p style={{ marginTop: '10px' }}>This is a demo application inspired by Javaf.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
