import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-dark text-slate-300 font-sans flex overflow-hidden">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">
        <div className="h-16 border-b border-border-glass bg-surface-bg flex items-center px-4 md:hidden">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white">
             <Menu size={24} />
           </button>
           <span className="ml-4 font-bold text-white tracking-widest uppercase">Admin Command Center</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
