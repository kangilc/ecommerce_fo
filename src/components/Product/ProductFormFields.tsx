import React from 'react';
import type { ProductRequest } from '../../types/product';
import ProductAiCopyHelper from './ProductAiCopyHelper';

interface ProductFormFieldsProps {
  formData: Partial<ProductRequest>;
  onChange: (updater: (prev: Partial<ProductRequest>) => Partial<ProductRequest>) => void;
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({ formData, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'description' ? value : Number(value),
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    onChange((prev) => ({
      ...prev,
      tags,
    }));
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name ?? ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price (KRW)</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price ?? 0}
          onChange={handleInputChange}
          required
          min="0"
        />
      </div>
      <div className="form-group">
        <label htmlFor="stockQuantity">Stock Quantity</label>
        <input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          value={formData.stockQuantity ?? 0}
          onChange={handleInputChange}
          required
          min="0"
        />
      </div>
      <div className="form-group">
        <label htmlFor="sellerId">Seller ID</label>
        <input
          type="number"
          id="sellerId"
          name="sellerId"
          value={formData.sellerId ?? 1}
          onChange={handleInputChange}
          required
          min="1"
        />
      </div>

      <ProductAiCopyHelper
        productName={formData.name ?? ''}
        price={formData.price}
        onApply={({ description, tags }) =>
          onChange((prev) => ({
            ...prev,
            description,
            tags,
          }))
        }
      />

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="상품 상세 설명을 입력하거나 위의 Gemini AI 버튼으로 자동 생성하세요."
          value={formData.description ?? ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="예: 무선이어폰, 블루투스, 경량"
          value={(formData.tags ?? []).join(', ')}
          onChange={handleTagsChange}
        />
      </div>
    </>
  );
};

export default ProductFormFields;
