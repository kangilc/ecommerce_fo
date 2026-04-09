import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findProductById } from '../../api/product';
import type { ProductResponse } from '../../types/product';
import './ProductPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await findProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <section id="center"><div>Loading product details...</div></section>;
  if (error) return <section id="center"><div className="error-message">{error}</div></section>;
  if (!product) return <section id="center"><div>Product not found</div></section>;

  return (
    <section id="center">
      <div className="detail-container">
        <div className="detail-header">
          <h2>Product Detail: {product.name}</h2>
          <span className="price-tag">{product.price.toLocaleString()} KRW</span>
        </div>
        
        <div className="info-grid">
          <div className="info-item"><strong>ID:</strong> {product.id}</div>
          <div className="info-item"><strong>Name:</strong> {product.name}</div>
          <div className="info-item"><strong>Price:</strong> {product.price.toLocaleString()} KRW</div>
          <div className="info-item"><strong>Stock Quantity:</strong> {product.stockQuantity}</div>
          <div className="info-item"><strong>Seller ID:</strong> {product.sellerId}</div>
        </div>

        <div className="detail-footer" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/products" className="back-button">Back to List</Link>
          <Link to={`/products/${product.id}/edit`} className="view-button">Edit Product</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
