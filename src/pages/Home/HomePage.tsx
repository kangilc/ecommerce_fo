import React, { useEffect, useState } from 'react';
import { findAllProducts } from '../../api/product';
import type { ProductResponse } from '../../types/product';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await findAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError('Failed to load products for the main page');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = (product: ProductResponse) => {
    alert(`Thank you! You have selected: ${product.name}\nPrice: ${product.price.toLocaleString()} KRW\n(This is a placeholder for the ordering system)`);
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
