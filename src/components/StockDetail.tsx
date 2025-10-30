import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchStockPrice, fetchStockNews, fetchChartData, fetchStockInsight } from '../services/stockService';
import type { StockPrice, NewsItem, ChartData, StockInsight } from '../types';

interface StockDetailProps {
  ticker: string;
  onClose: () => void;
}

const StockDetail: React.FC<StockDetailProps> = ({ ticker, onClose }) => {
  const [price, setPrice] = useState<StockPrice | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [insight, setInsight] = useState<StockInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [priceData, newsData, chartDataResult, insightData] = await Promise.all([
          fetchStockPrice(ticker),
          fetchStockNews(ticker),
          fetchChartData(ticker),
          fetchStockInsight(ticker)
        ]);
        
        setPrice(priceData);
        setNews(newsData);
        setChartData(chartDataResult);
        setInsight(insightData);
      } catch (error) {
        console.error('Error loading stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ticker]);

  const isPositive = price && price.change >= 0;

  const analystData = insight ? [
    { name: '매수', value: insight.analysts.buy, fill: '#10b981' },
    { name: '보유', value: insight.analysts.hold, fill: '#f59e0b' },
    { name: '매도', value: insight.analysts.sell, fill: '#ef4444' }
  ] : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div>
            <h2>{ticker}</h2>
            {price && (
              <div className="detail-price">
                <span className="price-large">${price.price.toFixed(2)}</span>
                <span className={`change-large ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {isPositive ? '+' : ''}{price.change.toFixed(2)} ({isPositive ? '+' : ''}{price.changePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="loading-center">데이터 로딩 중...</div>
        ) : (
          <div className="detail-content">
            {/* 가격 차트 */}
            <section className="detail-section">
              <h3>30일 가격 추이</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </section>

            {/* 인사이트 */}
            {insight && (
              <section className="detail-section">
                <h3>애널리스트 의견</h3>
                <p className="insight-summary">{insight.summary}</p>
                
                <div className="analyst-chart">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analystData} layout="vertical">
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {insight.targetPrice && (
                  <div className="target-price">
                    <span>목표가:</span>
                    <strong>${insight.targetPrice.toFixed(2)}</strong>
                  </div>
                )}
              </section>
            )}

            {/* 뉴스 */}
            <section className="detail-section">
              <h3>최신 뉴스</h3>
              <div className="news-list">
                {news.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="news-item"
                  >
                    <div className="news-header">
                      <span className="news-source">{item.source}</span>
                      <span className="news-date">
                        {new Date(item.publishedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <h4 className="news-title">
                      {item.title}
                      <ExternalLink size={14} />
                    </h4>
                    <p className="news-summary">{item.summary}</p>
                    {item.sentiment && (
                      <span className={`sentiment-badge ${item.sentiment}`}>
                        {item.sentiment === 'positive' ? '긍정적' : item.sentiment === 'negative' ? '부정적' : '중립'}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
