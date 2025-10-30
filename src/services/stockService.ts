// import axios from 'axios'; // 실제 API 연동 시 사용
import type { Stock, StockPrice, NewsItem, ChartData, StockInsight } from '../types';

// Mock API - 실제 환경에서는 Alpha Vantage, Yahoo Finance API, 또는 한국투자증권 API 등을 사용
// const API_BASE_URL = 'https://api.example.com'; // 실제 API URL로 교체 필요

// LocalStorage 키
const STORAGE_KEY = 'stock-watchlist';

// 저장된 티커 목록 가져오기
export const getSavedStocks = (): Stock[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

// 티커 저장
export const saveStock = (stock: Stock): void => {
  const stocks = getSavedStocks();
  const exists = stocks.find(s => s.ticker === stock.ticker);
  if (!exists) {
    stocks.push(stock);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }
};

// 티커 삭제
export const removeStock = (ticker: string): void => {
  const stocks = getSavedStocks();
  const filtered = stocks.filter(s => s.ticker !== ticker);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Mock 데이터 생성 함수들
const generateMockPrice = (ticker: string): StockPrice => {
  const basePrice = ticker.length * 10 + Math.random() * 100;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    ticker,
    price: basePrice,
    change,
    changePercent: (change / basePrice) * 100,
    volume: Math.floor(Math.random() * 10000000),
    marketCap: `${(Math.random() * 1000).toFixed(2)}B`
  };
};

const generateMockNews = (ticker: string): NewsItem[] => {
  const newsTemplates = [
    { title: `${ticker} 주가 상승세 지속, 투자자들 주목`, sentiment: 'positive' as const },
    { title: `${ticker}, 신제품 발표로 시장 기대감 증가`, sentiment: 'positive' as const },
    { title: `${ticker} 실적 발표 앞두고 주가 변동성 확대`, sentiment: 'neutral' as const },
    { title: `${ticker}, 경쟁사 대비 시장 점유율 확대`, sentiment: 'positive' as const },
    { title: `${ticker} 주가 조정, 전문가들은 매수 기회로 평가`, sentiment: 'neutral' as const }
  ];

  return newsTemplates.slice(0, 3).map((template, idx) => ({
    id: `${ticker}-news-${idx}`,
    ticker,
    title: template.title,
    summary: `${template.title}에 대한 상세 분석입니다. 최근 시장 동향과 기업의 실적을 종합적으로 평가한 결과...`,
    url: `https://news.example.com/${ticker}/${idx}`,
    source: ['Reuters', 'Bloomberg', '한국경제', '매일경제'][Math.floor(Math.random() * 4)],
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    sentiment: template.sentiment
  }));
};

const generateMockChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  let basePrice = 100 + Math.random() * 50;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    basePrice += (Math.random() - 0.5) * 5;
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(basePrice, 10),
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
};

const generateMockInsight = (ticker: string): StockInsight => {
  const buy = Math.floor(Math.random() * 15) + 5;
  const hold = Math.floor(Math.random() * 10) + 3;
  const sell = Math.floor(Math.random() * 5);
  
  return {
    ticker,
    summary: `${ticker}는 현재 긍정적인 시장 전망을 보이고 있습니다. 애널리스트들의 평균 목표가는 현재가 대비 상승 여력이 있는 것으로 분석됩니다.`,
    analysts: { buy, hold, sell },
    targetPrice: 100 + Math.random() * 100
  };
};

// API 함수들 (실제로는 실제 API를 호출해야 함)
export const fetchStockPrice = async (ticker: string): Promise<StockPrice> => {
  // 실제 환경에서는 API 호출
  // const response = await axios.get(`${API_BASE_URL}/quote/${ticker}`);
  // return response.data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockPrice(ticker));
    }, 500);
  });
};

export const fetchStockNews = async (ticker: string): Promise<NewsItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockNews(ticker));
    }, 600);
  });
};

export const fetchChartData = async (_ticker: string): Promise<ChartData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockChartData());
    }, 700);
  });
};

export const fetchStockInsight = async (ticker: string): Promise<StockInsight> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockInsight(ticker));
    }, 550);
  });
};

// 티커 검색/검증 (실제로는 API로 티커가 유효한지 확인)
export const validateTicker = async (ticker: string): Promise<{ valid: boolean; name?: string; exchange?: 'US' | 'KR' }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation - 실제로는 API 호출
      const isKorean = ticker.endsWith('.KS') || ticker.endsWith('.KQ');
      resolve({
        valid: ticker.length >= 1,
        name: `${ticker} Corporation`,
        exchange: isKorean ? 'KR' : 'US'
      });
    }, 300);
  });
};
