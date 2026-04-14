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
    // 1. 로그인 여부 체크
    const isLoggedIn = !!localStorage.getItem('refresh_token');
    
    if (!isLoggedIn) {
      if (window.confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    // 2. 로그인된 상태라면 주문 진행
    try {
      // 로컬 스토리지에 저장된 유저 정보 파싱 (로그인 시 저장해둔 정보)
      const userInfoStr = localStorage.getItem('user_info');
      let currentBuyerId = 1; // Default fallback fallback
      
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

      // 주문 완료 후 백엔드의 정확한 최신 데이터(재고수량)를 불러오기 위해 화면을 가리지 않게 (silent) 리프레시 진행
      await fetchProducts(false);
    } catch (e: any) {
      console.error(e);
      alert('주문 처리 중 오류가 발생했습니다: ' + (e.response?.data?.message || '알 수 없는 오류'));
    }
  };

  if (loading) return <section id="center"><div>Loading latest products...</div></section>;
  if (error) return <section id="center"><div className="error-message">{error}</div></section>;

  return (
    <div className="home-page">
      <section className="hero-banner">
        <h1>Premium E-Commerce Store</h1>
        <p>Discover our amazing products with the best prices.</p>
      </section>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-placeholder">
              <span className="stock-badge">{product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}</span>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">{product.price.toLocaleString()} KRW</p>
              <button 
                className="buy-button" 
                onClick={() => handleBuy(product)}
                disabled={product.stockQuantity <= 0}
              >
                {product.stockQuantity > 0 ? 'Buy Now' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
