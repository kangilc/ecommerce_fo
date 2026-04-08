import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findById } from '../../api/auth';
import type { UserRegisterResponse } from '../../types/auth';
import './BuyerPage.css';

const BuyerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [buyer, setBuyer] = useState<UserRegisterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuyer = async () => {
      if (!id) return;
      try {
        const data = await findById(id);
        setBuyer(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch buyer details');
      } finally {
        setLoading(false);
      }
    };
    fetchBuyer();
  }, [id]);

  if (loading) return <section id="center"><div>Loading buyer details...</div></section>;
  if (error) return <section id="center"><div className="error-message">{error}</div></section>;
  if (!buyer) return <section id="center"><div>Buyer not found</div></section>;

  return (
    <section id="center">
      <div className="detail-container">
        <div className="detail-header">
          <h2>Buyer Profile: {buyer.name}</h2>
          <span className={`status-badge ${(buyer.buyerStatus || 'UNKNOWN').toLowerCase()}`}>
            {buyer.buyerStatus || 'N/A'}
          </span>
        </div>
        
        <div className="info-grid">
          <div className="info-item"><strong>ID:</strong> {buyer.id}</div>
          <div className="info-item"><strong>Email:</strong> {buyer.email}</div>
          <div className="info-item"><strong>Phone:</strong> {buyer.phone || 'N/A'}</div>
          <div className="info-item"><strong>Address:</strong> {buyer.address || 'N/A'}</div>
          <div className="info-item"><strong>City:</strong> {buyer.city || 'N/A'}</div>
          <div className="info-item"><strong>Zip:</strong> {buyer.zip || 'N/A'}</div>
          <div className="info-item"><strong>Status:</strong> {buyer.buyerStatus}</div>
        </div>

        <div className="detail-footer">
          <Link to="/buyers" className="back-button">Back to List</Link>
          <Link to={`/buyers/${buyer.id}/edit`} className="view-button" style={{ marginLeft: '1rem' }}>Edit Info</Link>
        </div>
      </div>
    </section>
  );
};

export default BuyerDetailPage;
