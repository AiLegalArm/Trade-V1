import React from 'react';
import { motion } from 'motion/react';
import { Copy, Users, Gift, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export const Referrals = () => {
  const refLink = 'https://bullenhaus.com/ref/USER123';

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    toast.success('Referral link copied!');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">Referrals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-white/5 rounded-xl">
           <Users className="text-accent-primary mb-4" size={32} />
           <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Invited Users</h3>
           <p className="text-3xl font-bold text-white">12</p>
        </div>
        <div className="glass-card p-6 border border-white/5 rounded-xl">
           <Gift className="text-accent-secondary mb-4" size={32} />
           <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Rewards Earned</h3>
           <p className="text-3xl font-bold text-white">$450.00</p>
        </div>
        <div className="glass-card p-6 border border-white/5 rounded-xl">
           <TrendingUp className="text-blue-500 mb-4" size={32} />
           <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Conversion Rate</h3>
           <p className="text-3xl font-bold text-white">24%</p>
        </div>
      </div>

      <div className="glass-card p-8 border border-white/5 rounded-xl text-center space-y-4">
         <h2 className="text-2xl font-bold text-white">Invite Friends & Earn</h2>
         <p className="text-slate-400 max-w-lg mx-auto">Share your referral link and earn up to 40% commission on your friends' trading fees.</p>
         <div className="flex items-center justify-center gap-4 mt-6 max-w-md mx-auto">
            <input type="text" readOnly value={refLink} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none" />
            <button onClick={handleCopy} className="px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold rounded-lg flex items-center gap-2 transition-colors">
               <Copy size={18} /> Copy
            </button>
         </div>
      </div>
    </motion.div>
  );
};
