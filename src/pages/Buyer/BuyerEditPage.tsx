import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findById, update } from '../../api/auth';
import type { UserRegisterRequest } from '../../types/auth';
import './BuyerPage.css';

const BuyerEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserRegisterRequest>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBuyer = async () => {
      if (!id) return;
      try {
        const data = await findById(id);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          zip: data.zip || '',
        });
      } catch (err: any) {
        setError('Failed to fetch buyer details for editing');
      } finally {
        setLoading(false);
      }
    };
    fetchBuyer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');

    try {
      await update(id, formData);
      navigate(`/buyers/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update buyer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <section id="center"><div>Loading...</div></section>;

  return (
    <section id="center">
      <div className="edit-container detail-container">
        <h2>Edit Buyer Info</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} />
            </div>
          </div>
          
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

export default BuyerEditPage;
