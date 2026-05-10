import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Percent, Minus, Plus, Bitcoin, ShieldAlert, Target, ShieldX, TrendingUp, TrendingDown } from 'lucide-react';
import { useTradingContext } from '../../contexts/TradingContext';
import { useTradingStore } from '../../stores/tradingStore';

export const AdvancedOrderPanel: React.FC = () => {
  const { 
    currentPair, currentPrice, priceChangePercent24h,
    leverage, setLeverage,
    takeProfit, setTakeProfit,
    stopLoss, setStopLoss,
    marginType, setMarginType,
    orderSize: amount, setOrderSize: setAmount,
    orderType, setOrderType
  } = useTradingContext();

  const openPosition = useTradingStore(s => s.openPosition);
  const placeOrder = useTradingStore(s => s.placeOrder);

  const isPositive = (priceChangePercent24h || 0) >= 0;

  const parsedAmount = parseFloat(amount) || 0;
  const marginRequired = currentPrice ? (parsedAmount * currentPrice) / leverage : 0;
  const estLiqLong = currentPrice ? currentPrice * (1 - 1/leverage + 0.005) : 0;
  const estLiqShort = currentPrice ? currentPrice * (1 + 1/leverage - 0.005) : 0;
  
  const handleExecute = (type: 'Long' | 'Short') => {
    if (!parsedAmount || parsedAmount <= 0) return alert('Invalid amount');
    if (!currentPrice) return alert('Price not loaded');

    const tp = parseFloat(takeProfit) || null;
    const sl = parseFloat(stopLoss) || null;

    if (orderType === 'Market') {
      const liqPrice = type === 'Long'
        ? currentPrice * (1 - 1/leverage + 0.005)
        : currentPrice * (1 + 1/leverage - 0.005);

      openPosition({
        symbol: currentPair,
        type,
        entryPrice: currentPrice,
        size: parsedAmount,
        leverage,
        marginType,
        margin: marginRequired,
        liquidationPrice: Math.max(0, liqPrice),
        stopLoss: sl,
        takeProfit: tp,
      });
    } else {
      const priceEl = document.getElementById('conditional-price') as HTMLInputElement;
      const orderPrice = parseFloat(priceEl?.value || '');
      if (!orderPrice) return alert(`Please enter a valid ${orderType} price`);
      
      placeOrder({
        symbol: currentPair,
        type: orderType as any,
        positionType: type,
        price: orderPrice,
        size: parsedAmount,
        leverage,
        marginType,
        stopLoss: sl,
        takeProfit: tp
      })
    }
    
    // reset amount
    setAmount('0');
    setTakeProfit('');
    setStopLoss('');
  };

  return (
    <div className="glass-card flex flex-col relative overflow-hidden h-full">
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">Launch Protocol</h3>
        <div className="flex items-center gap-1 p-1 bg-[#111] rounded-lg border border-white/5">
           {['Market', 'Limit', 'Stop'].map(t => (
             <button 
               key={t}
               onClick={() => setOrderType(t as any)}
               className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${
                 orderType === t ? 'bg-accent-primary text-black shadow-neon-gold' : 'text-slate-500 hover:text-white'
               }`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar relative z-10">
        {/* Pair Display */}
        <div className="p-4 bg-[#111] border border-white/10 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Bitcoin size={20} className="text-orange-500" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-white leading-none">{currentPair.replace('USDT', ' / USDT')}</h4>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Perpetual</span>
             </div>
          </div>
          <div className="text-right">
             <div className="text-sm font-mono font-bold text-white">
                {currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '---'}
             </div>
             <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-accent-secondary' : 'text-accent-quaternary'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {priceChangePercent24h ? (priceChangePercent24h > 0 ? '+' : '') + priceChangePercent24h.toFixed(2) + '%' : '---'}
             </div>
          </div>
        </div>

        {/* Margin & Leverage */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <div className="flex justify-between items-end mb-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Margin</label>
              </div>
              <div className="flex bg-[#111] border border-white/10 rounded-xl p-1">
                 {['Cross', 'Isolated'].map(t => (
                    <button 
                       key={t}
                       onClick={() => setMarginType(t as any)}
                       className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${marginType === t ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                       {t}
                    </button>
                 ))}
              </div>
           </div>
           <div>
              <div className="flex justify-between items-end mb-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Leverage</label>
                 <span className="text-[10px] font-bold text-accent-primary">{leverage}x</span>
              </div>
              <div className="flex items-center bg-[#111] border border-white/10 rounded-xl px-2">
                 <button onClick={() => setLeverage(Math.max(1, leverage - 1))} className="p-1.5 text-slate-400 hover:text-white"><Minus size={14}/></button>
                 <div className="flex-1 px-2 relative py-2">
                    <input 
                       type="range" 
                       min="1" 
                       max="125" 
                       value={leverage} 
                       onChange={(e) => setLeverage(Number(e.target.value))}
                       className="w-full h-1 bg-white/20 rounded-full appearance-none outline-none accent-accent-primary" 
                    />
                 </div>
                 <button onClick={() => setLeverage(Math.min(125, leverage + 1))} className="p-1.5 text-slate-400 hover:text-white"><Plus size={14}/></button>
              </div>
           </div>
        </div>

        {/* Amount */}
        <div>
           <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Order Size</label>
           </div>
           <div className="relative group mb-2">
              <input 
                 type="text" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full p-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-accent-primary/50 transition-all pr-12" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 group-focus-within:text-accent-primary transition-colors">Amount</span>
           </div>
           
           {/* Quick Amount Buttons */}
           <div className="flex gap-2">
              {['25%', '50%', '75%', '100%'].map(pct => (
                 <button 
                   key={pct}
                   onClick={() => setAmount((parseFloat(pct) / 100 * 10).toFixed(2))} // Mocking 10 as available balance for now
                   className="flex-1 py-1 bg-[#111] hover:bg-white/10 border border-white/5 rounded text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                 >
                   {pct}
                 </button>
              ))}
           </div>
        </div>

        {/* Limit/Stop Price */}
        {orderType !== 'Market' && (
          <div>
            <div className="flex justify-between items-end mb-2 mt-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
                <Target size={10}/> {orderType} Price
              </label>
            </div>
            <div className="relative group">
              <input 
                 type="text" 
                 id="conditional-price"
                 placeholder={currentPrice?.toLocaleString() || '0.00'}
                 className="w-full p-3 bg-[#111] border border-white/10 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-accent-primary/50 transition-all pr-12" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 group-focus-within:text-accent-primary transition-colors">Price</span>
            </div>
          </div>
        )}

        {/* TP / SL */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <div className="flex justify-between items-end mb-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><Target size={10} className="text-accent-secondary" /> Take Profit</label>
              </div>
              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="None"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full p-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-accent-secondary/50 transition-all"
                 />
              </div>
           </div>
           <div>
              <div className="flex justify-between items-end mb-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={10} className="text-accent-quaternary" /> Stop Loss</label>
              </div>
              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="None"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full p-2.5 bg-[#111] border border-white/10 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-accent-quaternary/50 transition-all"
                 />
              </div>
           </div>
        </div>

        {/* Risk & Liquidation Info */}
        <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
           <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-500">Margin Required</span>
              <span className="text-white font-mono">{marginRequired.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT</span>
           </div>
           
           <div className="flex flex-col gap-1 border-t border-white/5 pt-2 mt-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-500">Est. Liq (Long)</span>
                <span className="text-white font-mono">{estLiqLong.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-500">Est. Liq (Short)</span>
                <span className="text-white font-mono">{estLiqShort.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
              </div>
           </div>

           <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider border-t border-white/5 pt-2 mt-2">
              <span className="text-slate-500">Risk Meter</span>
              <span className={leverage > 50 ? "text-accent-quaternary" : leverage > 20 ? "text-orange-500" : "text-accent-secondary"}>
                 {leverage > 50 ? "High" : leverage > 20 ? "Medium" : "Low"}
              </span>
           </div>
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className={`h-full ${leverage > 50 ? 'bg-gradient-to-r from-accent-quaternary/50 to-accent-quaternary w-full' : leverage > 20 ? 'bg-gradient-to-r from-orange-500/50 to-orange-500 w-2/3' : 'bg-gradient-to-r from-accent-secondary/50 to-accent-secondary w-1/3'}`}/>
           </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 space-y-4 bg-surface-bg/50 backdrop-blur-md relative z-10">
         <div className="flex gap-4">
            <button onClick={() => handleExecute('Long')} className="flex-1 py-4 bg-gradient-to-r from-accent-secondary/90 to-accent-secondary rounded-xl text-xs font-bold text-black shadow-neon-emerald hover:brightness-110 active:scale-95 transition-all text-center flex flex-col items-center justify-center gap-1">
               <span className="uppercase tracking-widest text-[10px] opacity-70">Buy / Long</span>
            </button>
            <button onClick={() => handleExecute('Short')} className="flex-1 py-4 bg-gradient-to-r from-accent-quaternary/90 to-accent-quaternary rounded-xl text-xs font-bold text-white shadow-neon-rose hover:brightness-110 active:scale-95 transition-all text-center flex flex-col items-center justify-center gap-1">
               <span className="uppercase tracking-widest text-[10px] opacity-70">Sell / Short</span>
            </button>
         </div>
      </div>
    </div>
  );
};
