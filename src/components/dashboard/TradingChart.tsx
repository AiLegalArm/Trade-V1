import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { MousePointer2, Settings, Type, Crosshair, Pencil, Move, Crop, Plus } from 'lucide-react';
import { useTradingContext } from '../../contexts/TradingContext';
import { useTradingStore } from '../../stores/tradingStore';

export const TradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { currentPair } = useTradingContext();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontFamily: 'Outfit, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        rightOffset: 12,
        barSpacing: 8,
        fixLeftEdge: true,
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00E676',
      downColor: '#FF3D00',
      borderVisible: false,
      wickUpColor: '#00E676',
      wickDownColor: '#FF3D00',
      priceFormat: { type: 'price', precision: currentPair.includes('JPY') ? 3 : currentPair.endsWith('USDT') ? 2 : 5, minMove: 0.00001 },
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', 
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    const emaSeries = chart.addSeries(LineSeries, { color: '#D4AF37', lineWidth: 2 });

    let ws: WebSocket | null = null;
    let unsub: (() => void) | null = null;
    let lastCandleTime = 0;
    
    // Generate dummy historical for forex
    const generateDummyForex = (basePrice: number) => {
      const cData = [];
      const vData = [];
      const eData = [];
      let currentVal = basePrice;
      const now = Date.now() / 1000;
      let sum = 0;

      for (let i = 500; i >= 0; i--) {
        const time = now - i * 60;
        const volatility = basePrice * 0.001;
        const open = currentVal + (Math.random() - 0.5) * volatility;
        const close = open + (Math.random() - 0.5) * volatility * 2;
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;
        
        currentVal = close;

        cData.push({ time, open, high, low, close });

        const isUp = close >= open;
        vData.push({ time, value: Math.random() * 1000 + 500, color: isUp ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 61, 0, 0.3)' });

        sum += close;
        eData.push({ time, value: 500 - i >= 8 ? (sum/9) : (sum / ((500-i) + 1)) });
        if (500 - i >= 8) sum -= cData[500 - i - 8].close;
      }
      return { cData, vData, eData };
    };

    const isForex = !currentPair.endsWith('USDT');

    if (isForex) {
       const curPrice = useTradingStore.getState().prices[currentPair] || 1.1;
       const { cData, vData, eData } = generateDummyForex(curPrice);
       candlestickSeries.setData(cData as any);
       volumeSeries.setData(vData as any);
       emaSeries.setData(eData as any);

       if (cData.length > 0) {
           lastCandleTime = cData[cData.length - 1].time;
       }

       let lastPrice = curPrice;
       unsub = useTradingStore.subscribe(
          (state) => {
             const newPrice = state.prices[currentPair];
             if (!newPrice || newPrice === lastPrice) return;
             lastPrice = newPrice;
             
             const now = Math.floor(Date.now() / 1000);
             // A new candle every 60s
             const candleTime = now - (now % 60);

             // Extremely simplified live candle update just for visual effect
             candlestickSeries.update({
                time: candleTime as any,
                open: newPrice, // not perfectly realistic but visual logic works
                high: newPrice * 1.0001,
                low: newPrice * 0.9999,
                close: newPrice
             });
          }
       );
    } else {
       // Binance Crypto logic
       const fetchHistoricalData = async () => {
         try {
           const symbol = currentPair.toUpperCase();
           const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=500`);
           const data = await res.json();
           
           const cData = [];
           const vData = [];
           const eData = [];
           let sum = 0;
           
           for(let i = 0; i < data.length; i++) {
             const d = data[i];
             const time = d[0] / 1000;
             const open = parseFloat(d[1]);
             const high = parseFloat(d[2]);
             const low = parseFloat(d[3]);
             const close = parseFloat(d[4]);
             const volume = parseFloat(d[5]);
             
             cData.push({ time, open, high, low, close });
             
             const isUp = close >= open;
             vData.push({ time, value: volume, color: isUp ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 61, 0, 0.3)' });
             
             sum += close;
             const ema = i >= 8 ? (sum / 9) : (sum / (i + 1));
             eData.push({ time, value: ema });
             if(i >= 8) sum -= parseFloat(data[i-8][4]);
           }
           
           candlestickSeries.setData(cData as any);
           volumeSeries.setData(vData as any);
           emaSeries.setData(eData as any);
           
           const lowerSymbol = symbol.toLowerCase();
           ws = new WebSocket(`wss://stream.binance.com:9443/ws/${lowerSymbol}@kline_1m`);
           
           ws.onmessage = (event) => {
             const msg = JSON.parse(event.data);
             if (msg && msg.k) {
               const k = msg.k;
               const time = k.t / 1000;
               const open = parseFloat(k.o);
               const high = parseFloat(k.h);
               const low = parseFloat(k.l);
               const close = parseFloat(k.c);
               const volume = parseFloat(k.v);
               
               candlestickSeries.update({ time: time as any, open, high, low, close });
               const isUp = close >= open;
               volumeSeries.update({ time: time as any, value: volume, color: isUp ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 61, 0, 0.3)' });
             }
           };
         } catch (err) {
           console.error("Failed to load historical data", err);
         }
       };
       fetchHistoricalData();
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ws) ws.close();
      if (unsub) unsub();
      chart.remove();
    };
  }, [currentPair]);

  return (
    <div className="relative w-full h-full flex bg-[#0a0a0a]">
      {/* Left Drawing Tools Sidebar */}
      <div className="w-12 h-full border-r border-white/5 flex flex-col items-center py-4 gap-4 z-10 bg-surface-bg/50">
        {[MousePointer2, Crosshair, Pencil, Move, Crop, Type, Plus].map((Icon, idx) => (
          <button key={idx} className="p-2 text-slate-500 hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-all">
            <Icon size={16} />
          </button>
        ))}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />
        
        {/* Indicators Toolbar */}
        <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
          <div className="px-3 py-1.5 bg-surface-bg/80 backdrop-blur border border-white/10 rounded-lg text-[10px] font-bold flex items-center gap-2 text-white pointer-events-auto cursor-pointer hover:border-accent-primary/50 transition-colors">
             <Settings size={12} className="text-accent-primary" /> Indicators <span className="text-slate-500 ml-2">3 Active</span>
          </div>
          <div className="px-3 py-1.5 bg-surface-bg/80 backdrop-blur border border-white/10 rounded-lg text-[10px] font-bold flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-white/5 transition-colors text-accent-primary">
             EMA (9)
          </div>
          <div className="px-3 py-1.5 bg-surface-bg/80 backdrop-blur border border-white/10 rounded-lg text-[10px] font-bold flex items-center gap-2 pointer-events-auto cursor-pointer test-slate-300 hover:bg-white/5 transition-colors text-white">
             MACD (12, 26, 9)
          </div>
          <div className="px-3 py-1.5 bg-surface-bg/80 backdrop-blur border border-white/10 rounded-lg text-[10px] font-bold flex items-center gap-2 pointer-events-auto cursor-pointer test-slate-300 hover:bg-white/5 transition-colors text-white">
             RSI (14)
          </div>
        </div>
      </div>
    </div>
  );
};

