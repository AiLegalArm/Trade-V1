import React from 'react';
import { motion } from 'motion/react';
import { DashboardStats } from './DashboardStats';
import { GamificationWidget } from './GamificationWidget';
import { TradingChart } from './TradingChart';
import { AdvancedOrderPanel } from './AdvancedOrderPanel';
import { Watchlist, MarketMovers, RecentActivity } from './SecondaryWidgets';
import { UniverseBanners } from './UniverseBanners';
import { Maximize2, Share2, MoreHorizontal, ChevronRight, Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';

import { TradingProvider, useTradingContext } from '../../contexts/TradingContext';
import { PositionsAndOrdersPanel } from './PositionsAndOrdersPanel';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Dashboard = () => {
  return (
    <TradingProvider>
      <DashboardContent />
    </TradingProvider>
  );
};

const DashboardContent = () => {
  const { currentPair, currentPrice, priceChangePercent24h, timeframe, setTimeframe } = useTradingContext();
  const isPositive = (priceChangePercent24h || 0) >= 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1700px] mx-auto space-y-6"
    >
      {/* Top Header Section */}
      <motion.div variants={itemVariants} className="flex items-end justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white tracking-tight leading-none mb-2"
          >
            Bullenhaus Terminal
          </motion.h1>
          <p className="text-slate-400 font-medium tracking-wide">Elite trading intelligence for masters of the market.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-bg bg-slate-800 overflow-hidden ring-1 ring-accent-primary/30">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-surface-bg bg-gradient-to-br from-accent-primary to-yellow-600 flex items-center justify-center text-[10px] font-bold text-black shadow-neon-gold leading-none">
              +128
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Live Analysts</span>
        </div>
      </motion.div>

      {/* Row 1: Global Stats */}
      <motion.div variants={itemVariants}>
        <DashboardStats />
      </motion.div>

      {/* Row 2: Main Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Section (Main Terminal) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Detailed Market Chart Card */}
          <motion.div variants={itemVariants} className="glass-card p-6 holo-border">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                   <Bitcoin size={28} className="text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{currentPair.replace('USDT', ' / USDT')}</h3>
                    <ChevronRight size={14} className="rotate-90 text-slate-500" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bitcoin</p>
                </div>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <div>
                   <p className="text-xl font-mono font-bold text-white leading-none mb-1">
                     {currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '---'}
                   </p>
                   <span className={`text-[10px] font-bold flex items-center gap-1 ${isPositive ? 'text-accent-secondary' : 'text-accent-quaternary'}`}>
                      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />} 
                      {priceChangePercent24h ? (priceChangePercent24h > 0 ? '+' : '') + priceChangePercent24h.toFixed(2) + '%' : '---'}
                   </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="hidden xl:flex items-center gap-6 border-r border-white/5 pr-6">
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">24h Change</p>
                       <p className={`text-xs font-mono font-bold ${isPositive ? 'text-accent-secondary' : 'text-accent-quaternary'}`}>
                         {priceChangePercent24h ? (priceChangePercent24h > 0 ? '+' : '') + priceChangePercent24h.toFixed(2) + '%' : '---'}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                       {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map(tf => (
                         <button 
                           key={tf} 
                           onClick={() => setTimeframe(tf)}
                           className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${tf === timeframe ? 'bg-gradient-to-r from-accent-primary to-yellow-600 text-black shadow-neon-gold' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                           {tf}
                         </button>
                       ))}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-xl">
                       <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Maximize2 size={14}/></button>
                       <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Share2 size={14}/></button>
                       <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={14}/></button>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="relative h-[480px] chart-grid rounded-2xl overflow-hidden border border-white/5">
               <TradingChart />
               
               {/* Chart Overlays */}
               <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1 bg-surface-bg/80 backdrop-blur border border-white/10 rounded-lg text-[10px] font-bold flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" /> Indicators
                  </div>
                  <div className="px-3 py-1 bg-surface-bg/80 backdrop-blur border border-white/10 rounded-lg text-[10px] font-bold">
                     Overlay: 1.2505
                  </div>
               </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div variants={itemVariants} className="md:col-span-12 xl:col-span-7 flex flex-col h-full">
              <PositionsAndOrdersPanel />
            </motion.div>

            {/* Advanced Order Section */}
            <motion.div variants={itemVariants} className="md:col-span-12 xl:col-span-5 flex flex-col h-full min-h-[600px]">
               <AdvancedOrderPanel />
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar Section */}
        <div className="col-span-12 lg:col-span-3 space-y-6 lg:sticky lg:top-8 overflow-y-auto custom-scrollbar max-h-[calc(100vh-6rem)] pb-20">
          <motion.div variants={itemVariants}><GamificationWidget /></motion.div>
          <motion.div variants={itemVariants}><Watchlist /></motion.div>
          <motion.div variants={itemVariants}><MarketMovers /></motion.div>
          <motion.div variants={itemVariants}><RecentActivity /></motion.div>
        </div>
      </div>

      {/* Bottom Banners Section */}
      <motion.div variants={itemVariants}>
        <UniverseBanners />
      </motion.div>
    </motion.div>
  );
};

