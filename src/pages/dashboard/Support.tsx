import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const Support = () => {
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    toast.success('Support ticket created. We will get back to you shortly.');
    setMsg('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[800px] mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Help & Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-6">
            <div className="glass-card p-6 border border-white/5 rounded-xl">
               <h3 className="text-xl font-bold text-white mb-4">Contact Support</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none">
                       <option>General Inquiry</option>
                       <option>Trading Issue</option>
                       <option>Deposit/Withdrawal</option>
                       <option>Account Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Message</label>
                    <textarea 
                       value={msg}
                       onChange={e => setMsg(e.target.value)}
                       rows={5} 
                       className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none" 
                       placeholder="Describe your issue..."
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold rounded-lg flex items-center justify-center gap-2">
                     <Send size={18} /> Submit Request
                  </button>
               </form>
            </div>
         </div>

         <div className="space-y-6">
            <div className="glass-card p-6 border border-white/5 rounded-xl">
               <h3 className="text-xl font-bold text-white mb-4">FAQ</h3>
               <div className="space-y-4">
                  <details className="group">
                     <summary className="font-bold text-slate-300 cursor-pointer list-none flex justify-between">
                        How long do withdrawals take?
                     </summary>
                     <p className="text-sm text-slate-500 mt-2">Crypto withdrawals are usually processed within 10-30 minutes depending on network congestion.</p>
                  </details>
                  <details className="group">
                     <summary className="font-bold text-slate-300 cursor-pointer list-none flex justify-between">
                        What are the trading fees?
                     </summary>
                     <p className="text-sm text-slate-500 mt-2">Our standard maker/taker fee is 0.1%. Holders of Elite tiers get up to 50% discount.</p>
                  </details>
               </div>
            </div>
            
            <div className="glass-card p-6 border border-white/5 rounded-xl">
               <h3 className="text-xl font-bold text-white mb-4">My Tickets</h3>
               <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-center">
                  <MessageSquare size={24} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-slate-400 text-sm">No active tickets</p>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};
