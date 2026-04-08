import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import './App.css';

function Home() {
  return (
    <section id="center">
      <h1>Welcome to E-Commerce Store</h1>
      <p>Please <Link to="/register">Register</Link> to get started.</p>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div style={{ background: 'yellow', padding: '10px', color: 'black' }}>
        Debug: App is rendering
      </div>
      <nav style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <Link to="/" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Home</Link>
        <Link to="/register" style={{ color: 'var(--text-h)', textDecoration: 'none' }}>Register</Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </Router>
  );
}

export default App;
