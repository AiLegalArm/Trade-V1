import React, { useState } from 'react';
import { useTradingStore } from '../../stores/tradingStore';

export const PositionsAndOrdersPanel = () => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');
  const positions = useTradingStore(s => s.positions);
  const orders = useTradingStore(s => s.orders);
  const cancelOrder = useTradingStore(s => s.cancelOrder);
  const closePosition = useTradingStore(s => s.closePosition);
  const prices = useTradingStore(s => s.prices);

  const openPositions = positions.filter(p => p.status === 'open');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const orderHistory = orders.filter(o => o.status !== 'pending').slice(-20); // last 20

  return (
    <div className="glass-card p-6 relative overflow-hidden flex-1 flex flex-col h-full min-h-[400px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/5 pb-2">
        <div className="flex space-x-6">
          <button 
            className={`text-sm font-bold tracking-wide transition-colors relative pb-2 ${activeTab === 'positions' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('positions')}
          >
            Open Positions ({openPositions.length})
            {activeTab === 'positions' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary shadow-neon-gold" />}
          </button>
          <button 
            className={`text-sm font-bold tracking-wide transition-colors relative pb-2 ${activeTab === 'orders' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('orders')}
          >
            Pending Orders ({pendingOrders.length})
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary shadow-neon-gold" />}
          </button>
          <button 
            className={`text-sm font-bold tracking-wide transition-colors relative pb-2 ${activeTab === 'history' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('history')}
          >
            Order History
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary shadow-neon-gold" />}
          </button>
        </div>
        <button className="text-[10px] font-bold text-accent-primary hover:underline shadow-none bg-transparent mb-2">
          View Detail
        </button>
      </div>

      <div className="overflow-x-auto relative z-10 flex-1 custom-scrollbar">
        {activeTab === 'positions' && (
          <table className="w-full relative">
            <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 sticky top-0 bg-surface-card z-20">
              <tr>
                <th className="text-left pb-4 pt-2">Market</th>
                <th className="text-left pb-4 pt-2">Size / Lev</th>
                <th className="text-left pb-4 pt-2">Entry / Mark</th>
                <th className="text-right pb-4 pt-2">Unrealized P&L</th>
                <th className="text-right pb-4 pt-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {openPositions.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No open positions</td></tr>
              ) : (
                openPositions.map((pos) => {
                  const currentPrice = prices[pos.symbol] || pos.entryPrice;
                  const pnlPct = pos.margin > 0 ? (pos.unrealizedPnL / pos.margin) * 100 : 0;
                  const isPositive = pos.unrealizedPnL >= 0;
                  
                  return (
                    <tr key={pos.id} className="group hover:bg-white/5 transition-all duration-200">
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center font-bold text-white text-[10px]">
                                {pos.symbol.substring(0, 3)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs leading-none mb-1 group-hover:text-accent-primary transition-colors">{pos.symbol}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{pos.marginType}</p>
                            </div>
                        </div>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <div className="text-xs font-bold transition-all flex flex-col">
                            <div>
                                <span className={`${pos.type === 'Long' ? 'text-accent-secondary' : 'text-accent-quaternary'} mr-2`}>{pos.type}</span>
                                <span className="text-slate-300">{pos.size}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">{pos.leverage}x</span>
                        </div>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                            <p className="text-xs font-mono font-bold text-slate-400">{pos.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                            <p className="text-[10px] font-mono text-slate-500">{currentPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                        </div>
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                            <span className={`text-xs font-bold ${isPositive ? 'text-accent-secondary drop-shadow-[0_0_5px_rgba(0,230,118,0.3)]' : 'text-accent-quaternary drop-shadow-[0_0_5px_rgba(255,61,0,0.3)]'}`}>
                               {isPositive ? '+' : ''}{pos.unrealizedPnL.toFixed(2)} USDT
                            </span>
                            <span className={`text-[10px] font-bold ${isPositive ? 'text-accent-secondary/60' : 'text-accent-quaternary/60'}`}>
                               {isPositive ? '+' : ''}{pnlPct.toFixed(2)}%
                            </span>
                        </div>
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => closePosition(pos.id, currentPrice)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-accent-quaternary hover:text-white border border-white/10 rounded text-[10px] font-bold text-slate-400 transition-colors"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="w-full relative">
            <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 sticky top-0 bg-surface-card z-20">
              <tr>
                <th className="text-left pb-4 pt-2">Market</th>
                <th className="text-left pb-4 pt-2">Type</th>
                <th className="text-left pb-4 pt-2">Order Price</th>
                <th className="text-left pb-4 pt-2">Size / Lev</th>
                <th className="text-right pb-4 pt-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pendingOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No pending orders</td></tr>
              ) : (
                pendingOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/5 transition-all duration-200">
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center font-bold text-white text-[10px]">
                              {order.symbol.substring(0, 3)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs leading-none mb-1 group-hover:text-accent-primary transition-colors">{order.symbol}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{order.marginType}</p>
                          </div>
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                        <div className="text-xs font-bold transition-all flex flex-col">
                            <div>
                                <span className={`${order.positionType === 'Long' ? 'text-accent-secondary' : 'text-accent-quaternary'} mr-2`}>{order.positionType}</span>
                                <span className="text-slate-300">{order.type}</span>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-slate-400">{order.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                       <div className="text-xs font-bold flex flex-col">
                          <span className="text-white">{order.size}</span>
                          <span className="text-[10px] text-slate-500">{order.leverage}x</span>
                       </div>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-zinc-700 hover:text-white border border-white/10 rounded text-[10px] font-bold text-slate-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'history' && (
          <table className="w-full relative">
            <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 sticky top-0 bg-surface-card z-20">
              <tr>
                <th className="text-left pb-4 pt-2">Market</th>
                <th className="text-left pb-4 pt-2">Type</th>
                <th className="text-left pb-4 pt-2">Price</th>
                <th className="text-right pb-4 pt-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orderHistory.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No recent order history</td></tr>
              ) : (
                orderHistory.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/5 transition-all duration-200 opacity-80 hover:opacity-100">
                    <td className="py-4 whitespace-nowrap text-xs font-bold text-white">{order.symbol}</td>
                    <td className="py-4 whitespace-nowrap text-xs text-slate-400">
                      <span className={`${order.positionType === 'Long' ? 'text-accent-secondary' : 'text-accent-quaternary'} mr-1`}>{order.positionType}</span>
                      {order.type}
                    </td>
                    <td className="py-4 whitespace-nowrap text-xs font-mono text-slate-400">{order.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td className="py-4 whitespace-nowrap text-right">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                         order.status === 'filled' ? 'bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                         {order.status}
                      </span>
                    </td>
                  </tr>
                )).reverse()
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
