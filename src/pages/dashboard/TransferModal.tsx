import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Download, Upload, ArrowRight, Bitcoin, CheckCircle2 } from 'lucide-react';

export const TransferModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
}> = ({ isOpen, onClose, type }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  
  const isDeposit = type === 'deposit';

  const handleAction = () => {
    setStep(2);
    setTimeout(() => {
      setStep(1);
      setAmount('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-bg border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${isDeposit ? 'bg-accent-secondary shadow-neon-emerald' : 'bg-orange-500 shadow-neon-rose'}`} />
            
            {step === 1 ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isDeposit ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-orange-500/10 text-orange-500'}`}>
                      {isDeposit ? <Download size={20} /> : <Upload size={20} />}
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {isDeposit ? 'Simulated Deposit' : 'Simulated Withdraw'}
                    </h3>
                  </div>
                  <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Select Asset</label>
                    <div className="p-3 bg-[#111] border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3">
                        <Bitcoin size={20} className="text-orange-500" />
                        <div>
                          <p className="text-sm font-bold text-white">USDT</p>
                          <p className="text-[10px] text-slate-500">Tether (ERC20)</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                       <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Amount</label>
                       {isDeposit ? (
                         <span className="text-[10px] font-bold text-slate-500">Add virtual funds</span>
                       ) : (
                         <span className="text-[10px] font-bold text-slate-500">Available: <span className="text-white">1,633.50 USDT</span></span>
                       )}
                    </div>
                    <div className="relative group">
                       <input 
                         type="number"
                         placeholder="0.00"
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         className="w-full p-4 bg-[#111] border border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-accent-primary/50 transition-all pl-12"
                       />
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-500 font-bold">$</span>
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 group-focus-within:text-accent-primary transition-colors">USDT</span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent-primary/5 border border-accent-primary/10 rounded-xl flex items-start gap-3">
                    <ShieldCheck size={16} className="text-accent-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This is a <strong>simulated transaction</strong> for training purposes. No real funds will be transferred or required.
                    </p>
                  </div>

                  <button 
                    onClick={handleAction}
                    disabled={!amount || Number(amount) <= 0}
                    className={`w-full py-4 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 ${
                      isDeposit 
                      ? 'bg-accent-secondary text-black shadow-neon-emerald hover:brightness-110' 
                      : 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:brightness-110'
                    }`}
                  >
                    {isDeposit ? 'Confirm Sim. Deposit' : 'Confirm Sim. Withdraw'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${isDeposit ? 'bg-accent-secondary/20 text-accent-secondary' : 'bg-orange-500/20 text-orange-500'}`}
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">Transaction Processing</h3>
                   <p className="text-sm text-slate-400">{isDeposit ? 'Virtual funds are being added to your portfolio.' : 'Virtual withdrawal request submitted.'}</p>
                </div>
              </div>
            )}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
