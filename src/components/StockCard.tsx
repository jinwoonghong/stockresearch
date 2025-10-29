import React from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { Stock, StockPrice } from '../types';

interface StockCardProps {
  stock: Stock;
  price?: StockPrice;
  onRemove: (ticker: string) => void;
  onClick: (ticker: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, price, onRemove, onClick }) => {
  const isPositive = price && price.change >= 0;
  
  return (
    <div 
      className="stock-card"
      onClick={() => onClick(stock.ticker)}
    >
      <div className="stock-card-header">
        <div className="stock-info">
          <div className="stock-ticker">{stock.ticker}</div>
          <div className="stock-name">{stock.name}</div>
        </div>
        <button
          className="remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(stock.ticker);
          }}
          aria-label="Remove stock"
        >
          <X size={18} />
        </button>
      </div>
      
      {price ? (
        <div className="stock-price-info">
          <div className="price">${price.price.toFixed(2)}</div>
          <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {isPositive ? '+' : ''}{price.change.toFixed(2)} ({isPositive ? '+' : ''}{price.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
      
      <div className="stock-badge">{stock.exchange === 'KR' ? '🇰🇷 한국' : '🇺🇸 미국'}</div>
    </div>
  );
};

export default StockCard;
