# Stock Insights - 주식 뉴스 및 인사이트 모바일 웹

국내 및 해외 주식의 티커를 입력하여 실시간 뉴스, 가격 정보, 차트 분석, 애널리스트 인사이트를 확인할 수 있는 모바일 반응형 웹 애플리케이션입니다.

## 주요 기능

### 📊 주식 관리
- **티커 추가/삭제**: 국내(예: 005930.KS) 및 해외(예: AAPL) 주식 티커 등록
- **즐겨찾기 저장**: LocalStorage를 활용한 관심 종목 영구 저장
- **실시간 가격**: 각 종목의 현재가, 등락률 실시간 표시

### 📈 데이터 시각화
- **가격 차트**: Recharts를 활용한 30일 가격 추이 그래프
- **거래량 분석**: 일별 거래량 시각화
- **애널리스트 의견**: 매수/보유/매도 의견 분포 차트

### 📰 뉴스 및 인사이트
- **최신 뉴스**: 각 종목별 관련 뉴스 피드
- **감성 분석**: 긍정적/부정적/중립 뉴스 분류
- **목표가 분석**: 애널리스트 평균 목표가 제공

### 📱 모바일 최적화
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 대응
- **터치 친화적 UI**: 모바일 사용자 경험 최적화
- **다크 모드**: 눈의 피로를 줄이는 다크 테마

## 기술 스택

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI/UX**: 
  - Lucide React (아이콘)
  - Custom CSS (모바일 반응형)
- **데이터 시각화**: Recharts
- **HTTP Client**: Axios
- **상태 관리**: React Hooks + TanStack Query

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── StockCard.tsx       # 주식 카드 컴포넌트
│   ├── AddStockModal.tsx   # 주식 추가 모달
│   └── StockDetail.tsx     # 상세 정보 모달
├── services/            # 비즈니스 로직
│   └── stockService.ts     # 주식 데이터 API
├── types/               # TypeScript 타입 정의
│   └── index.ts
├── App.tsx              # 메인 앱 컴포넌트
├── App.css              # 스타일시트
└── main.tsx             # 앱 엔트리포인트
```

## API 연동 가이드

현재는 Mock 데이터를 사용하고 있습니다. 실제 API를 연동하려면 다음을 참고하세요:

### 추천 API 서비스

1. **미국 주식**: 
   - [Alpha Vantage](https://www.alphavantage.co/)
   - [Yahoo Finance API](https://www.yahoofinanceapi.com/)
   - [Finnhub](https://finnhub.io/)

2. **한국 주식**:
   - [한국투자증권 Open API](https://apiportal.koreainvestment.com/)
   - [네이버 금융 API](https://developers.naver.com/products/finance/)

### API 연동 방법

`src/services/stockService.ts` 파일에서 Mock 함수들을 실제 API 호출로 교체:

```typescript
export const fetchStockPrice = async (ticker: string): Promise<StockPrice> => {
  const response = await axios.get(`YOUR_API_URL/quote/${ticker}`, {
    headers: {
      'Authorization': `Bearer ${YOUR_API_KEY}`
    }
  });
  return response.data;
};
```

## 사용 방법

### 1. 주식 추가
- 우측 상단 "추가" 버튼 클릭
- 티커 입력 (예: AAPL, TSLA, 005930.KS)
- 또는 인기 종목에서 선택

### 2. 정보 확인
- 카드 클릭하여 상세 정보 확인
- 30일 가격 차트 보기
- 최신 뉴스 읽기
- 애널리스트 의견 확인

### 3. 관리
- 카드 우측 상단 X 버튼으로 삭제
- 자동으로 LocalStorage에 저장됨

## 향후 개발 계획

- [ ] 실제 API 연동 (Alpha Vantage, 한국투자증권 등)
- [ ] 포트폴리오 관리 기능
- [ ] 가격 알림 설정
- [ ] 여러 기간 차트 (1일, 1주, 1개월, 1년)
- [ ] PWA 지원 (오프라인 사용)
- [ ] 다국어 지원
- [ ] 테마 커스터마이징

## 라이선스

MIT License

## 기여

이슈 및 PR은 언제나 환영합니다!
