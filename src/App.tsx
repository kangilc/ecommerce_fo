import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import BuyerListPage from './pages/Buyer/BuyerListPage';
import BuyerDetailPage from './pages/Buyer/BuyerDetailPage';
import BuyerEditPage from './pages/Buyer/BuyerEditPage';
import './App.css';

function Home() {
  return (
    <section id="center">
      <h1>Welcome to E-Commerce Store</h1>
      <p>Please <Link to="/register">Register</Link> to get started.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/buyers" className="counter" style={{ textDecoration: 'none' }}>View Buyer List</Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        background: 'var(--bg)'
      }}>
        <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
        <Link to="/register" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Register</Link>
        <Link to="/buyers" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Buyers</Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/buyers" element={<BuyerListPage />} />
          <Route path="/buyers/:id" element={<BuyerDetailPage />} />
          <Route path="/buyers/:id/edit" element={<BuyerEditPage />} />
        </Routes>
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </Router>
  );
}

export default App;
