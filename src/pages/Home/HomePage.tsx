import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findAllProducts } from '../../api/product';
import { createOrder } from '../../api/order';
import type { ProductResponse } from '../../types/product';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await findAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Failed to load products for the main page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const handleBuy = async (product: ProductResponse) => {
    const isLoggedIn = !!localStorage.getItem('refresh_token');
    
    if (!isLoggedIn) {
      if (window.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    try {
      const userInfoStr = localStorage.getItem('user_info');
      let currentBuyerId = 1;
      
      if (userInfoStr) {
        try {
          const user = JSON.parse(userInfoStr);
          currentBuyerId = user.buyerId || user.id || 1;
        } catch (e) {}
      }

      await createOrder({ 
        buyerId: currentBuyerId, 
        productId: product.id, 
        quantity: 1, 
        amount: product.price 
      });
      alert(`${product.name} 주문이 성공적으로 완료되었습니다!`);
      await fetchProducts(false);
    } catch (e: any) {
      console.error(e);
      alert('주문 처리 중 오류가 발생했습니다: ' + (e.response?.data?.message || '알 수 없는 오류'));
    }
  };

  if (loading) return <div className="loading-state">Loading latest products...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="home-content">
      {/* Hero Banner Area */}
      <section className="main-banner">
        <div className="banner-slide">
          <div className="banner-text">
            <h2>Today's Specials</h2>
            <p>Up to 50% off on electronics!</p>
            <button className="banner-btn">Shop Now</button>
          </div>
          <div className="banner-image-placeholder">
            {/* Image would go here */}
          </div>
        </div>
      </section>

      {/* Quick Links / Categories */}
      <section className="quick-categories">
        {['Electronics', 'Fashion', 'Beauty', 'Food', 'Home', 'Books', 'Sports', 'Toys'].map(cat => (
          <div key={cat} className="category-item">
            <div className="category-icon-placeholder">{cat[0]}</div>
            <span>{cat}</span>
          </div>
        ))}
      </section>

      {/* Product List Section */}
      <section className="product-section">
        <div className="section-header">
          <h2>Rocket Delivery Products</h2>
          <span className="see-all">See All {'>'}</span>
        </div>
        <div className="cp-product-grid">
          {products.map((product) => (
            <div key={product.id} className="cp-product-card" onClick={() => navigate(`/products/${product.id}`)}>
              <div className="cp-product-image">
                <div className="image-box">
                  {/* <img src="..." alt={product.name} /> */}
                </div>
                {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                  <span className="stock-warning">Only {product.stockQuantity} left!</span>
                )}
                {product.stockQuantity === 0 && (
                  <div className="sold-out-overlay">Sold Out</div>
                )}
              </div>
              <div className="cp-product-info">
                <div className="product-name">{product.name}</div>
                <div className="price-area">
                  <span className="discount-rate">15%</span>
                  <span className="price-value">{(product.price * 0.85).toLocaleString()}</span>
                  <span className="currency">원</span>
                </div>
                <div className="original-price">{product.price.toLocaleString()}원</div>
                <div className="delivery-badge">
                  <span className="rocket-icon">🚀</span>
                  <span className="rocket-text">로켓배송</span>
                  <span className="arrival-date">내일(목) 도착 보장</span>
                </div>
                <div className="rating-area">
                  <span className="stars">★★★★☆</span>
                  <span className="review-count">(1,234)</span>
                </div>
                <button 
                  className="quick-buy-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(product);
                  }}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? 'Quick Buy' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
