import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      {/* Top Utility Bar */}
      <div className="header-top">
        <div className="container header-top-content">
          <ul className="utility-menu">
            {isLoggedIn ? (
              <>
                <li onClick={onLogout} className="clickable">Logout</li>
                <li><Link to="/products">Admin: Products</Link></li>
                <li><Link to="/buyers">Admin: Buyers</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Join Us</Link></li>
              </>
            ) }
            <li>Customer Service</li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container header-main-content">
          <div className="logo-section" onClick={() => navigate('/')}>
            <div className="logo-placeholder">JAVAF</div>
          </div>

          <div className="category-btn">
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Category</span>
          </div>

          <div className="search-bar-container">
            <div className="search-bar">
              <input type="text" placeholder="Search for products, brands, or categories" />
              <button className="search-btn">
                <i className="search-icon">🔍</i>
              </button>
            </div>
          </div>

          <div className="user-menu">
            <div className="user-item">
              <span className="user-icon">👤</span>
              <span className="user-label">My Page</span>
            </div>
            <div className="user-item">
              <span className="user-icon">🛒</span>
              <span className="user-label">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="header-bottom">
        <div className="container header-bottom-content">
          <ul className="nav-menu">
            <li className="active">Rocket Delivery</li>
            <li>Rocket Fresh</li>
            <li>Rocket Jikgu</li>
            <li>Gold Box</li>
            <li>Regular Delivery</li>
            <li>Events</li>
            <li>Gourmet</li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
