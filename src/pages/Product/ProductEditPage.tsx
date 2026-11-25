import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { extractApiErrorMessage, findProductById, updateProduct } from '../../api/product';
import ProductFormFields from '../../components/Product/ProductFormFields';
import type { ProductRequest } from '../../types/product';
import './ProductPage.css';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ProductRequest>>({
    name: '',
    price: 0,
    stockQuantity: 0,
    sellerId: 1,
    description: '',
    tags: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await findProductById(id);
        setFormData({
          name: data.name,
          price: data.price,
          stockQuantity: data.stockQuantity,
          sellerId: data.sellerId,
          description: data.description ?? '',
          tags: data.tags ?? [],
        });
      } catch (err: unknown) {
        setError(extractApiErrorMessage(err, 'Failed to fetch product details for editing'));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');

    try {
      await updateProduct(id, formData);
      navigate(`/products/${id}`);
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Failed to update product'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section id="center"><div>Loading...</div></section>;

  return (
    <section id="center">
      <div className="edit-container detail-container">
        <h2>Edit Product Info</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <ProductFormFields formData={formData} onChange={setFormData} />

          <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="register-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
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

export default ProductEditPage;
