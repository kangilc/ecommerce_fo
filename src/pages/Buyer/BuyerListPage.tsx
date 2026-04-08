import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { findAll } from '../../api/auth';
import type { UserRegisterResponse } from '../../types/auth';
import './BuyerPage.css';

const BuyerListPage: React.FC = () => {
  const [buyers, setBuyers] = useState<UserRegisterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const data = await findAll();
        console.log('--- UPDATED BuyerListPage Fetching ---', data);
        // The API now returns the actual array from .data.data
        setBuyers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch buyers');
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  if (loading) return <section id="center"><div>Loading buyers...</div></section>;
  if (error) return <section id="center"><div className="error-message">{error}</div></section>;

  return (
    <section id="center">
      <div className="list-container">
        <h2>Buyer List</h2>
        <table className="buyer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {buyers && Array.isArray(buyers) && buyers.map((buyer) => {
              if (!buyer) return null;
              const status = (buyer.buyerStatus || 'UNKNOWN').toString().toLowerCase();
              return (
                <tr key={buyer.id}>
                  <td>{buyer.id}</td>
                  <td>{buyer.name}</td>
                  <td>{buyer.email}</td>
                  <td>
                    <span className={`status ${status}`}>
                      {buyer.buyerStatus || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/buyers/${buyer.id}`} className="view-button">View Detail</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BuyerListPage;
