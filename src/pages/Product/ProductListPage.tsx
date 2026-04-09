import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { findAllProducts } from '../../api/product';
import type { ProductResponse } from '../../types/product';
import './ProductPage.css';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await findAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <section id="center"><div>Loading products...</div></section>;
  if (error) return <section id="center"><div className="error-message">{error}</div></section>;

  return (
    <section id="center">
      <div className="list-container">
        <div className="header-with-action">
          <h2>Product List</h2>
          <Link to="/products/new" className="view-button">Add New Product</Link>
        </div>
        <table className="buyer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString()} KRW</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <Link to={`/products/${product.id}`} className="view-button">Detail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductListPage;
