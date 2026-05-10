import { create } from 'zustand';

export type ForexTrend = 'bull' | 'bear' | 'sideways' | 'crash' | 'news';

export interface ForexPairConfig {
  symbol: string;
  price: number;
  basePrice: number;
  change24h: number;
  volatility: number;
  spread: number;
  trend: ForexTrend;
  isPaused: boolean;
}

const defaultPairs: Record<string, ForexPairConfig> = {
  'EURUSD': { symbol: 'EURUSD', price: 1.0850, basePrice: 1.0850, change24h: 0.12, volatility: 0.0001, spread: 0.0001, trend: 'sideways', isPaused: false },
  'GBPUSD': { symbol: 'GBPUSD', price: 1.2640, basePrice: 1.2640, change24h: -0.05, volatility: 0.0001, spread: 0.0001, trend: 'sideways', isPaused: false },
  'USDJPY': { symbol: 'USDJPY', price: 151.20, basePrice: 151.20, change24h: 0.45, volatility: 0.01, spread: 0.01, trend: 'sideways', isPaused: false },
  'XAUUSD': { symbol: 'XAUUSD', price: 2340.50, basePrice: 2340.50, change24h: 1.2, volatility: 0.5, spread: 0.2, trend: 'bull', isPaused: false },
};

interface ForexState {
  pairs: Record<string, ForexPairConfig>;
  globalVolatilityMultiplier: number;
  
  // Admin Actions
  updatePrice: (symbol: string, newPrice: number) => void;
  setVolatility: (symbol: string, vol: number) => void;
  setSpread: (symbol: string, spread: number) => void;
  setTrend: (symbol: string, trend: ForexTrend) => void;
  togglePause: (symbol: string) => void;
  resetMarket: (symbol: string) => void;
  tickSimulation: () => void;
}

export const useForexStore = create<ForexState>((set, get) => ({
  pairs: defaultPairs,
  globalVolatilityMultiplier: 1.0,

  updatePrice: (symbol, newPrice) => set(state => ({
    pairs: { ...state.pairs, [symbol]: { ...state.pairs[symbol], price: newPrice } }
  })),

  setVolatility: (symbol, volatility) => set(state => ({
    pairs: { ...state.pairs, [symbol]: { ...state.pairs[symbol], volatility } }
  })),

  setSpread: (symbol, spread) => set(state => ({
    pairs: { ...state.pairs, [symbol]: { ...state.pairs[symbol], spread } }
  })),

  setTrend: (symbol, trend) => set(state => ({
    pairs: { ...state.pairs, [symbol]: { ...state.pairs[symbol], trend } }
  })),

  togglePause: (symbol) => set(state => ({
    pairs: { ...state.pairs, [symbol]: { ...state.pairs[symbol], isPaused: !state.pairs[symbol].isPaused } }
  })),

  resetMarket: (symbol) => set(state => ({
    pairs: { 
      ...state.pairs, 
      [symbol]: { ...defaultPairs[symbol] } 
    }
  })),

  tickSimulation: () => set(state => {
    const newPairs = { ...state.pairs };
    let changed = false;

    Object.keys(newPairs).forEach(sym => {
      const p = newPairs[sym];
      if (p.isPaused) return;

      let move = (Math.random() - 0.5) * p.volatility * state.globalVolatilityMultiplier;
      
      if (p.trend === 'bull') {
        move += (Math.random() * p.volatility * 0.5);
      } else if (p.trend === 'bear') {
        move -= (Math.random() * p.volatility * 0.5);
      } else if (p.trend === 'crash') {
        move -= (Math.random() * p.volatility * 5); // Huge drop
      } else if (p.trend === 'news') {
        move += (Math.random() - 0.5) * p.volatility * 10; // Huge swings both ways
      }

      const newPrice = p.price + move;
      const change24h = ((newPrice - p.basePrice) / p.basePrice) * 100;
      
      if (newPrice !== p.price) {
        newPairs[sym] = { ...p, price: newPrice, change24h };
        changed = true;
      }
    });

    if (changed) {
       return { pairs: newPairs };
    }
    return state;
  })
}));
