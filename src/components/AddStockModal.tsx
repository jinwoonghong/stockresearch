import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { validateTicker } from '../services/stockService';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ticker: string, name: string, exchange: 'US' | 'KR') => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [ticker, setTicker] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!ticker.trim()) {
      setError('티커를 입력해주세요');
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateTicker(ticker.toUpperCase());
      if (result.valid && result.name && result.exchange) {
        onAdd(ticker.toUpperCase(), result.name, result.exchange);
        setTicker('');
        onClose();
      } else {
        setError('유효하지 않은 티커입니다');
      }
    } catch (err) {
      setError('티커 검증 중 오류가 발생했습니다');
    } finally {
      setIsValidating(false);
    }
  };

  const popularStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'US' as const },
    { ticker: 'MSFT', name: 'Microsoft Corp.', exchange: 'US' as const },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', exchange: 'US' as const },
    { ticker: 'TSLA', name: 'Tesla Inc.', exchange: 'US' as const },
    { ticker: '005930.KS', name: '삼성전자', exchange: 'KR' as const },
    { ticker: '000660.KS', name: 'SK하이닉스', exchange: 'KR' as const },
    { ticker: '035420.KS', name: 'NAVER', exchange: 'KR' as const },
    { ticker: '035720.KS', name: '카카오', exchange: 'KR' as const },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>주식 추가</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-stock-form">
          <div className="input-group">
            <Search size={20} className="input-icon" />
            <input
              type="text"
              placeholder="티커 입력 (예: AAPL, 005930.KS)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              disabled={isValidating}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary" disabled={isValidating}>
            {isValidating ? '확인 중...' : '추가하기'}
          </button>
        </form>

        <div className="popular-stocks">
          <h3>인기 종목</h3>
          <div className="popular-stocks-grid">
            {popularStocks.map((stock) => (
              <button
                key={stock.ticker}
                className="popular-stock-item"
                onClick={() => {
                  onAdd(stock.ticker, stock.name, stock.exchange);
                  onClose();
                }}
              >
                <div className="popular-ticker">{stock.ticker}</div>
                <div className="popular-name">{stock.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
