// Stock Types
export interface Stock {
  ticker: string;
  name: string;
  exchange: 'US' | 'KR';
}

export interface StockPrice {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
}

export interface NewsItem {
  id: string;
  ticker: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ChartData {
  date: string;
  price: number;
  volume: number;
}

export interface StockInsight {
  ticker: string;
  summary: string;
  analysts: {
    buy: number;
    hold: number;
    sell: number;
  };
  targetPrice?: number;
}
