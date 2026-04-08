import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import './App.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to E-Commerce Store</h1>
      <p>Please <Link to="/register">Register</Link> to get started.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
