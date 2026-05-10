import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export const Markets = () => {
  const [tab, setTab] = useState('Crypto');
  const [search, setSearch] = useState('');
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await res.json();
        const formatted = data
          .filter((d: any) => d.symbol.endsWith('USDT'))
          .map((d: any) => ({
            symbol: d.symbol,
            name: d.symbol.replace('USDT', ''),
            price: parseFloat(d.lastPrice),
            change: parseFloat(d.priceChangePercent),
            spread: Math.abs(parseFloat(d.askPrice) - parseFloat(d.bidPrice)).toFixed(4),
            volume: (parseFloat(d.quoteVolume) / 1000000).toFixed(2) + 'M',
            type: 'Crypto'
          }))
          .sort((a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume))
          .slice(0, 50); // Top 50 pairs
        setCryptoData(formatted);
      } catch (err) {
        console.error("Failed to fetch markets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const otherAssets = [
    { symbol: 'EURUSD', name: 'EUR/USD', price: 1.0850, change: 0.15, spread: '0.0001', volume: '-', type: 'Forex' },
    { symbol: 'GBPUSD', name: 'GBP/USD', price: 1.2640, change: -0.25, spread: '0.0002', volume: '-', type: 'Forex' },
    { symbol: 'USDJPY', name: 'USD/JPY', price: 155.30, change: 0.40, spread: '0.01', volume: '-', type: 'Forex' },
    { symbol: 'XAUUSD', name: 'Gold', price: 2350.50, change: 0.8, spread: '0.50', volume: '-', type: 'Metals' },
    { symbol: 'XAGUSD', name: 'Silver', price: 28.40, change: 1.2, spread: '0.02', volume: '-', type: 'Metals' },
  ];

  const allAssets = [...cryptoData, ...otherAssets];

  const filteredAssets = allAssets.filter(
    a => a.type === tab && (a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Markets Overview</h1>
           <p className="text-slate-400">Discover and trade top performing assets across global markets.</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between bg-surface-bg p-4 rounded-xl border border-white/5 gap-4">
        <div className="flex gap-2 p-1 bg-[#111] rounded-lg border border-white/5">
          {['Crypto', 'Forex', 'Metals'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${tab === t ? 'bg-accent-primary text-black shadow-neon-gold' : 'text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold text-white outline-none focus:border-accent-primary transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface-bg border border-white/5 rounded-xl overflow-hidden shadow-2xl relative">
        {loading && tab === 'Crypto' ? (
          <div className="flex items-center justify-center p-20 text-accent-primary">
             <RefreshCw className="animate-spin" size={32} />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#111] text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="p-4 rounded-tl-xl">Asset</th>
                <th className="p-4">Last Price</th>
                <th className="p-4">24h Change</th>
                <th className="p-4 hidden md:table-cell">Spread</th>
                <th className="p-4 hidden sm:table-cell">24h Volume</th>
                <th className="p-4 text-right rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAssets.map(asset => (
                <tr key={asset.symbol} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => navigate(`/trade?symbol=${asset.symbol}`)}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white group-hover:border-accent-primary/50 transition-colors">
                          {asset.name.substring(0, 1)}
                       </div>
                       <div>
                         <div className="font-bold text-white">{asset.symbol.replace('USDT', '')} <span className="text-[10px] text-slate-500">{asset.type === 'Crypto' ? '/ USDT' : ''}</span></div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{asset.name}</div>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white text-sm">
                    {asset.price < 1 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`p-4 font-bold text-sm ${asset.change >= 0 ? 'text-accent-secondary' : 'text-accent-quaternary'}`}>
                    <div className="flex items-center gap-1">
                      {asset.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(asset.change).toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-400 hidden md:table-cell">{asset.spread}</td>
                  <td className="p-4 text-sm font-mono text-slate-400 hidden sm:table-cell">{asset.volume}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/trade?symbol=${asset.symbol}`); }}
                      className="px-4 py-2 bg-white/5 hover:bg-accent-primary hover:text-black hover:shadow-neon-gold text-white rounded-lg transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">No assets found matching your criteria.</td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

