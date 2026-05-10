import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GamificationWidget = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 border-accent-primary/20 relative overflow-hidden holo-border"
    >
      {/* Abstract Background Decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center border border-accent-primary/30 shadow-neon-gold">
            <Trophy size={32} className="text-accent-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-accent-primary/70 uppercase tracking-[0.2em] mb-0.5">Current Level</p>
            <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Gold III</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-accent-primary glow-text">XP 88,450 / 100,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden mb-6 border border-white/5 relative z-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '88.45%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-accent-primary/50 to-accent-primary shadow-[0_0_10px_rgba(212,175,55,0.8)]"
        />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <button 
          onClick={() => navigate('/gamification')}
          className="px-5 py-2.5 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-xs font-bold text-accent-primary hover:bg-accent-primary hover:text-black hover:shadow-neon-gold transition-all duration-300 flex items-center gap-2"
        >
          View Rewards
          <ChevronRight size={14} />
        </button>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next: Diamond I</p>
      </div>
    </motion.div>
  );
};
