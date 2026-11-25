import React, { useState } from 'react';
import { extractApiErrorMessage, generateProductCopy } from '../../api/product';

interface ProductAiCopyHelperProps {
  productName: string;
  price?: number;
  onApply: (result: { description: string; tags: string[] }) => void;
}

const TONE_OPTIONS = [
  '신뢰감 있고 친절한',
  '감성적이고 트렌디한',
  '간결하고 전문적인',
];

const ProductAiCopyHelper: React.FC<ProductAiCopyHelperProps> = ({
  productName,
  price,
  onApply,
}) => {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError('상품명을 먼저 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await generateProductCopy({
        name: productName.trim(),
        price,
        keywords: keywords.trim() || undefined,
        tone,
      });
      setHighlights(result.highlights || []);
      onApply({
        description: result.description || '',
        tags: result.tags || [],
      });
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'AI 상품 설명 생성에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <strong>✨ Gemini AI 상품 설명 · 태그 생성</strong>
        <span className="ai-badge">shop-product 연동</span>
      </div>

      <div className="ai-controls-grid">
        <div className="form-group">
          <label htmlFor="ai-keywords">강조 키워드 (선택)</label>
          <input
            type="text"
            id="ai-keywords"
            placeholder="예: 경량, 방수, 선물용"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ai-tone">톤앤매너</label>
          <select
            id="ai-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            {TONE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className="ai-action-button"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Gemini AI가 작성 중...' : 'AI로 설명 · 태그 자동 채우기'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {highlights.length > 0 && (
        <div className="ai-highlights">
          <span className="ai-highlights-title">추천 핵심 포인트</span>
          <ul>
            {highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductAiCopyHelper;
