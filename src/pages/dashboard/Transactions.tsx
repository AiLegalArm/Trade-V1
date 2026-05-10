import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, ArrowRightLeft, CreditCard, Download } from 'lucide-react';

export const Transactions = () => {
  const [filter, setFilter] = useState('All');
  
  const txs = [
    { id: 'TX-98234', type: 'Deposit', asset: 'USDT', amount: 5000, fee: 0, date: '2023-10-01 14:30', status: 'Completed', network: 'TRC20' },
    { id: 'TX-98235', type: 'Trade', asset: 'BTCUSDT', amount: -200, fee: 0.5, date: '2023-10-02 09:15', status: 'Completed', network: '-' },
    { id: 'TX-98236', type: 'Withdrawal', asset: 'USDT', amount: 1000, fee: 1, date: '2023-10-05 16:45', status: 'Pending', network: 'ERC20' },
    { id: 'TX-98237', type: 'Fee', asset: 'USDT', amount: 5, fee: 0, date: '2023-10-02 09:15', status: 'Completed', network: '-' },
    { id: 'TX-98238', type: 'Deposit', asset: 'BTC', amount: 0.5, fee: 0, date: '2023-10-06 11:20', status: 'Completed', network: 'Bitcoin' },
    { id: 'TX-98239', type: 'Trade', asset: 'ETHUSDT', amount: 1500, fee: 1.5, date: '2023-10-07 18:05', status: 'Completed', network: '-' },
  ];

  const filtered = txs.filter(t => filter === 'All' || t.type === filter);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Deposit': return <ArrowDownRight size={16} className="text-accent-secondary" />;
      case 'Withdrawal': return <ArrowUpRight size={16} className="text-orange-500" />;
      case 'Trade': return <ArrowRightLeft size={16} className="text-accent-primary" />;
      case 'Fee': return <CreditCard size={16} className="text-slate-400" />;
      default: return <ArrowRightLeft size={16} className="text-slate-400" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
           <p className="text-slate-400">View and download your deposits, withdrawals, and trading activity.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-bold text-sm">
           <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Deposits</div>
            <div className="text-2xl font-bold text-white font-mono">$12,500.00</div>
         </div>
         <div className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Withdrawals</div>
            <div className="text-2xl font-bold text-white font-mono">$3,200.00</div>
         </div>
         <div className="glass-card p-6 rounded-2xl border border-white/5">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Trading Volume (30d)</div>
            <div className="text-2xl font-bold text-white font-mono">$45,820.50</div>
         </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between bg-surface-bg p-4 rounded-xl border border-white/5 gap-4">
        <div className="flex gap-2 p-1 bg-[#111] rounded-lg border border-white/5 overflow-x-auto w-full md:w-auto custom-scrollbar">
          {['All', 'Deposit', 'Withdrawal', 'Trade', 'Fee'].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${filter === t ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search TXID..." className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-accent-primary" />
           </div>
           <button className="px-4 py-2 bg-[#111] border border-white/10 rounded-lg flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
             <Filter size={16}/> <span className="hidden sm:inline">Filters</span>
           </button>
        </div>
      </div>

      <div className="bg-surface-bg border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#111] text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="p-4 rounded-tl-xl">Type & ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Asset / Network</th>
              <th className="p-4">Amount</th>
              <th className="p-4 hidden sm:table-cell">Fee</th>
              <th className="p-4 text-right rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(tx => (
              <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                       {getTypeIcon(tx.type)}
                     </div>
                     <div>
                        <div className="font-bold text-white text-sm">{tx.type}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tx.id}</div>
                     </div>
                  </div>
                </td>
                <td className="p-4">
                   <div className="text-sm text-white">{tx.date.split(' ')[0]}</div>
                   <div className="text-[10px] text-slate-500">{tx.date.split(' ')[1]}</div>
                </td>
                <td className="p-4">
                   <div className="font-bold text-white text-sm">{tx.asset}</div>
                   <div className="text-[10px] text-slate-500">{tx.network}</div>
                </td>
                <td className={`p-4 font-mono font-bold text-sm ${tx.amount > 0 ? 'text-accent-secondary' : tx.amount < 0 ? 'text-white' : 'text-slate-300'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </td>
                <td className="p-4 text-sm font-mono text-slate-500 hidden sm:table-cell">{tx.fee}</td>
                <td className="p-4 text-right">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded border text-[10px] uppercase tracking-widest font-bold ${tx.status === 'Completed' ? 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
