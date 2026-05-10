import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle2, Shield, User, Camera, ArrowRight, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const KYC = () => {
  const [status, setStatus] = useState('pending'); // pending, submitted, approved
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('KYC documents submitted successfully');
    setStatus('submitted');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[800px] mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
          <Shield className="text-accent-primary" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white leading-none mb-1">Identity Verification</h1>
          <p className="text-slate-400 text-sm">Complete KYC to unlock full trading features and higher limits.</p>
        </div>
      </div>

      {status === 'approved' && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-accent-secondary/10 border border-accent-secondary/20 p-8 rounded-2xl flex flex-col items-center text-center gap-4">
           <div className="w-20 h-20 bg-accent-secondary/20 rounded-full flex items-center justify-center text-accent-secondary">
             <CheckCircle2 size={40} />
           </div>
           <div>
              <h3 className="font-bold text-2xl text-white mb-2">Verification Complete</h3>
              <p className="text-slate-400 max-w-md">Your identity has been verified. You now have full access to all platform features with enhanced security.</p>
           </div>
        </motion.div>
      )}

      {status === 'submitted' && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-2xl flex flex-col items-center text-center gap-4">
           <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 animate-pulse">
             <FileText size={40} />
           </div>
           <div>
              <h3 className="font-bold text-2xl text-white mb-2">Under Review</h3>
              <p className="text-slate-400 max-w-md">Your documents are securely stored and currently under review by our compliance team. This usually takes 1-2 hours during business days.</p>
           </div>
        </motion.div>
      )}

      {status === 'pending' && (
        <div className="glass-card p-8 border border-white/5 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                 className="h-full bg-accent-primary" 
                 initial={{ width: 0 }}
                 animate={{ width: `${(step / 3) * 100}%` }}
                 transition={{ duration: 0.3 }}
              />
           </div>
           
           <div className="flex justify-between mb-8">
              {[
                { num: 1, title: 'Personal Details', icon: User },
                { num: 2, title: 'ID Document', icon: FileText },
                { num: 3, title: 'Liveness Check', icon: Camera }
              ].map((s) => (
                <div key={s.num} className={`flex flex-col items-center gap-2 ${step >= s.num ? 'text-accent-primary' : 'text-slate-500'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.num ? 'border-accent-primary bg-accent-primary/10' : 'border-slate-700 bg-surface-bg'}`}>
                    <s.icon size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{s.title}</span>
                </div>
              ))}
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                        <input type="text" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-primary transition-colors" placeholder="e.g. John" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                        <input type="text" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-primary transition-colors" placeholder="e.g. Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date of Birth</label>
                      <input type="date" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-primary transition-colors" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Passport / ID Card (Front)</label>
                       <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 transition-all cursor-pointer hover:border-accent-primary/50 group">
                          <Upload className="mx-auto text-slate-500 mb-4 group-hover:text-accent-primary transition-colors" size={32} />
                          <div className="text-white font-bold mb-1">Click to upload document front</div>
                          <span className="text-slate-500 text-xs uppercase tracking-widest">JPG, PNG or PDF (Max 5MB)</span>
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Take a selfie</label>
                       <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 transition-all cursor-pointer hover:border-accent-primary/50 group">
                          <Camera className="mx-auto text-slate-500 mb-4 group-hover:text-accent-primary transition-colors" size={32} />
                          <div className="text-white font-bold mb-1">Enable camera for Liveness Check</div>
                          <span className="text-slate-500 text-xs uppercase tracking-widest">Ensure good lighting</span>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="pt-4 flex justify-end">
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-white text-black font-bold rounded-xl transition-all hover:bg-white/90 flex items-center gap-2">
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="submit" className="w-full py-4 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold rounded-xl transition-all shadow-neon-gold uppercase tracking-widest text-sm">
                    Submit Verification
                  </button>
                )}
              </div>
           </form>
        </div>
      )}
    </motion.div>
  );
};
