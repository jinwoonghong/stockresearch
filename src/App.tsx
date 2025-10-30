import { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import StockCard from './components/StockCard';
import AddStockModal from './components/AddStockModal';
import StockDetail from './components/StockDetail';
import type { Stock, StockPrice } from './types';
import { getSavedStocks, saveStock, removeStock, fetchStockPrice } from './services/stockService';
import './App.css';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockPrices, setStockPrices] = useState<Map<string, StockPrice>>(new Map());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  // 저장된 주식 목록 로드
  useEffect(() => {
    const savedStocks = getSavedStocks();
    setStocks(savedStocks);
  }, []);

  // 주식 가격 정보 로드
  useEffect(() => {
    const loadPrices = async () => {
      for (const stock of stocks) {
        try {
          const price = await fetchStockPrice(stock.ticker);
          setStockPrices(prev => new Map(prev).set(stock.ticker, price));
        } catch (error) {
          console.error(`Error fetching price for ${stock.ticker}:`, error);
        }
      }
    };

    if (stocks.length > 0) {
      loadPrices();
    }
  }, [stocks]);

  const handleAddStock = (ticker: string, name: string, exchange: 'US' | 'KR') => {
    const newStock: Stock = { ticker, name, exchange };
    saveStock(newStock);
    setStocks([...stocks, newStock]);
  };

  const handleRemoveStock = (ticker: string) => {
    removeStock(ticker);
    setStocks(stocks.filter(s => s.ticker !== ticker));
    setStockPrices(prev => {
      const newMap = new Map(prev);
      newMap.delete(ticker);
      return newMap;
    });
  };

  const handleStockClick = (ticker: string) => {
    setSelectedTicker(ticker);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <TrendingUp size={28} />
            <h1>Stock Insights</h1>
          </div>
          <button 
            className="add-button"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            <span>추가</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        {stocks.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={64} strokeWidth={1.5} />
            <h2>관심 주식을 추가해보세요</h2>
            <p>국내, 해외 주식의 티커를 입력하여<br />실시간 뉴스와 인사이트를 확인할 수 있습니다</p>
            <button 
              className="btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={20} />
              첫 주식 추가하기
            </button>
          </div>
        ) : (
          <div className="stock-grid">
            {stocks.map((stock) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                price={stockPrices.get(stock.ticker)}
                onRemove={handleRemoveStock}
                onClick={handleStockClick}
              />
            ))}
          </div>
        )}
      </main>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStock}
      />

      {selectedTicker && (
        <StockDetail
          ticker={selectedTicker}
          onClose={() => setSelectedTicker(null)}
        />
      )}
    </div>
  );
}

export default App;
