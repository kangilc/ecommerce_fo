import React, { useState } from 'react';
import { askProductQuestion, extractApiErrorMessage } from '../../api/product';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ProductAiQaBoxProps {
  productId: number;
  productName: string;
}

const QUICK_QUESTIONS = [
  '이 상품의 핵심 특징을 요약해 주세요.',
  '현재 가격과 재고 상태가 어떻게 되나요?',
  '선물용으로 구매하기 괜찮을까요?',
];

const ProductAiQaBox: React.FC<ProductAiQaBoxProps> = ({ productId, productName }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [previousInteractionId, setPreviousInteractionId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendQuestion = async (textToAsk: string) => {
    const trimmed = textToAsk.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError('');
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setQuestion('');

    try {
      const res = await askProductQuestion(productId, {
        question: trimmed,
        previousInteractionId,
      });
      if (res.interactionId) {
        setPreviousInteractionId(res.interactionId);
      }
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.answer || '답변을 생성하지 못했습니다.' },
      ]);
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'AI 답변 요청에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendQuestion(question);
  };

  const handleReset = () => {
    setMessages([]);
    setPreviousInteractionId(undefined);
    setError('');
  };

  return (
    <div className="ai-panel" style={{ marginTop: '1.5rem' }}>
      <div className="ai-panel-header">
        <strong>🤖 Gemini AI 상품 Q&A ({productName})</strong>
        {messages.length > 0 && (
          <button type="button" className="ai-reset-button" onClick={handleReset}>
            대화 초기화
          </button>
        )}
      </div>

      <div className="ai-quick-questions">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            className="ai-chip-button"
            onClick={() => sendQuestion(q)}
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      {messages.length > 0 && (
        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-chat-bubble ai-chat-${msg.role}`}>
              <span className="ai-chat-role">{msg.role === 'user' ? '나' : 'Gemini AI'}</span>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ai-qa-form">
        <input
          type="text"
          placeholder="상품에 대해 궁금한 점을 질문해 보세요..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="ai-action-button" disabled={loading || !question.trim()}>
          {loading ? '응답 중...' : '질문하기'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProductAiQaBox;
