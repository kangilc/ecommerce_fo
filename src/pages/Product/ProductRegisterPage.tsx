import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerProduct } from '../../api/product';
import type { ProductRequest } from '../../types/product';
import './ProductPage.css';

const ProductRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    price: 0,
    stockQuantity: 0,
    sellerId: 1, // Default or selected from some context
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerProduct(formData);
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to register product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="center">
      <div className="register-container detail-container">
        <h2>Register Product</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (KRW)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="stockQuantity">Stock Quantity</label>
            <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="sellerId">Seller ID</label>
            <input type="number" id="sellerId" name="sellerId" value={formData.sellerId} onChange={handleChange} required min="1" />
          </div>
          
          <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Registering...' : 'Register Product'}
            </button>
            <button type="button" className="back-button" style={{ background: '#6c757d' }} onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </section>
  );
};

export default ProductRegisterPage;
