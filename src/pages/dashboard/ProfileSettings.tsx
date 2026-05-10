import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Mail, Camera, Save, AlertCircle, Shield, Smartphone, Key, Lock, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const ProfileSettings: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [mfaEnabled, setMfaEnabled] = useState(false); // UI State for demo, could integrate with supabase.auth.mfa

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl }
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Terminal identity updated.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const generateAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-[0.2em]">Operator Profile</h2>
          <p className="text-sm text-accent-primary font-bold mt-1 tracking-widest uppercase opacity-70">Clearance Level: Elite</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-lg text-[10px] font-bold text-accent-primary uppercase tracking-widest">
          <Shield size={12} /> Encrypted Session
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 holo-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <User size={20} className="text-accent-primary" />
              Identity Configuration
            </h3>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
                  message.type === 'error' 
                  ? 'bg-accent-quaternary/10 border-accent-quaternary/30 text-accent-quaternary' 
                  : 'bg-accent-secondary/10 border-accent-secondary/30 text-accent-secondary'
                }`}
              >
                <AlertCircle size={16} />
                <p className="text-xs font-bold uppercase tracking-wider">{message.text}</p>
              </motion.div>
            )}

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer" onClick={generateAvatar}>
                  <div className="w-32 h-32 rounded-full border-4 border-[#111] overflow-hidden shadow-neon-gold p-1 bg-gradient-to-br from-accent-primary to-yellow-600">
                    <img 
                      src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full bg-[#050505] object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="text-white mb-1" size={24} />
                     <span className="text-[10px] font-bold text-white uppercase tracking-wider">Cycle Avatar</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">Visual ID</p>
              </div>

              <form onSubmit={updateProfile} className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={16} className="text-accent-primary/50" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={16} className="text-slate-600" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-500 cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-accent-primary/10 border border-accent-primary/30 rounded-xl text-xs font-bold text-accent-primary hover:bg-accent-primary hover:text-black shadow-neon-gold active:scale-[0.98] transition-all flex items-center gap-2 group"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
                    ) : (
                      <>
                        Update Protocol <Save size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="glass-card p-8 holo-border">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Shield size={20} className="text-accent-secondary" />
              Advanced Security (MFA)
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Secondary validation required</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${mfaEnabled ? 'bg-accent-secondary' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: mfaEnabled ? 26 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                    <Key size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Hardware Key Support</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">YubiKey & FIDO2 Protocols</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors">Configure</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Language Preference</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">English / German</p>
                  </div>
                </div>
                <select 
                   value={i18n.language}
                   onChange={(e) => {
                     i18n.changeLanguage(e.target.value);
                     localStorage.setItem('i18nextLng', e.target.value);
                   }}
                   className="px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-sm font-bold text-white outline-none"
                >
                   <option value="en">English</option>
                   <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informational / Stats Sidebar */}
        <div className="space-y-6">
           <div className="glass-card p-6 border-accent-tertiary/20">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-accent-tertiary/20 flex items-center justify-center text-accent-tertiary shadow-neon-blue">
                    <Lock size={20} />
                 </div>
                 <h4 className="text-sm font-bold text-white uppercase tracking-widest">Security Status</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Last Entrance</span>
                    <span className="text-slate-300 font-mono">12m ago</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Active Sessions</span>
                    <span className="text-accent-secondary font-bold">01</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Encryption Grade</span>
                    <span className="text-white font-bold">AES-256-GCM</span>
                 </div>
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent border border-accent-primary/10">
              <p className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em] mb-2">Privacy Protocol</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your biological identity data is never shared. Bullenhaus utilizes zero-knowledge proofs for cross-terminal validation.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

