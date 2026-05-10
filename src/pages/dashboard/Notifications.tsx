import React from 'react';
import { motion } from 'motion/react';

export const Notifications = () => {
  const notifs = [
    { id: 1, title: 'Deposit Successful', desc: 'Your deposit of 5,000 USDT has been credited.', time: '10 mins ago', read: false },
    { id: 2, title: 'Price Alert', desc: 'BTC has dropped below $65,000.', time: '1 hour ago', read: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[800px] mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
        <button className="text-accent-primary text-sm font-bold hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifs.map(n => (
          <div key={n.id} className={`p-4 rounded-xl border transition-all ${n.read ? 'bg-surface-bg border-white/5' : 'bg-accent-primary/5 border-accent-primary/20'}`}>
             <div className="flex justify-between items-start mb-1">
                <h3 className="text-white font-bold">{n.title}</h3>
                <span className="text-xs text-slate-500">{n.time}</span>
             </div>
             <p className="text-sm text-slate-400">{n.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
