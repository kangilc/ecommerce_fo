import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
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
        <Link to="/register" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Join Us</Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/buyers" element={<BuyerListPage />} />
          <Route path="/buyers/:id" element={<BuyerDetailPage />} />
          <Route path="/buyers/:id/edit" element={<BuyerEditPage />} />
          
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductRegisterPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductEditPage />} />
        </Routes>
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </Router>
  );
}

export default App;
