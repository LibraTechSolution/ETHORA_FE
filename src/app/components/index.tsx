'use client';
import TradingViewWidget from '@/app/components/Tradingview/TradingViewWidget';

export const HomeView = () => {
  return (
    <>
      <div className="h-96">
        <TradingViewWidget />
      </div>
    </>
  );
};
