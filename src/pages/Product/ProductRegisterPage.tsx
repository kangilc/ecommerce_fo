import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractApiErrorMessage, registerProduct } from '../../api/product';
import ProductFormFields from '../../components/Product/ProductFormFields';
import type { ProductRequest } from '../../types/product';
import './ProductPage.css';

const ProductRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    price: 0,
    stockQuantity: 0,
    sellerId: 1,
    description: '',
    tags: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerProduct(formData);
      navigate('/products');
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Failed to register product'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="center">
      <div className="register-container detail-container">
        <h2>Register Product</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <ProductFormFields
            formData={formData}
            onChange={(updater) =>
              setFormData((prev) => ({
                ...prev,
                ...updater(prev),
              }))
            }
          />

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
