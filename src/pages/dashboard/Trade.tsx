import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dashboard } from '../../components/dashboard/Dashboard';
import { useTradingContext } from '../../contexts/TradingContext';

export const Trade = () => {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol');
  const { setCurrentPair } = useTradingContext();

  useEffect(() => {
    if (symbol) {
      setCurrentPair(symbol);
    }
  }, [symbol, setCurrentPair]);

  // Re-use the dashboard layout for trade page as per instructions
  // (Trade page has same requirements as dashboard: chart, order panel, etc.)
  return <Dashboard />;
};
