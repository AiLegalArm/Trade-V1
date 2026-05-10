import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  History, 
  RefreshCw, 
  Settings, 
  LogOut,
  X,
  LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/src/lib/utils';

const AdminSidebarItem = ({ icon: Icon, label, to, active, onClick }: any) => {
  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        whileHover={{ x: 4 }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          active ? "bg-rose-500/10 text-rose-500" : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
        )}
      >
        <Icon size={20} className={cn(active ? "text-rose-500" : "group-hover:text-slate-100")} />
        <span className="font-medium text-sm tracking-wide">{label}</span>
      </motion.div>
    </Link>
  );
};

export const AdminSidebar = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <aside className="w-64 h-full border-r border-border-glass bg-surface-bg flex flex-col p-4 relative">
      <div className="flex items-center gap-3 mb-8 px-2 mt-2 relative">
        {onClose && (
           <button onClick={onClose} className="absolute right-0 top-0 md:hidden p-2 text-slate-400 hover:text-white z-10">
              <X size={20} />
           </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(243,24,96,0.3)]">
           <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
           <p className="font-bold text-white uppercase tracking-widest text-xs">Command</p>
           <p className="text-[10px] text-rose-500 font-bold uppercase tracking-[0.2em]">Center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <AdminSidebarItem icon={LayoutDashboard} label="Overview" to="/admin" active={currentPath === '/admin'} onClick={onClose} />
        <AdminSidebarItem icon={Users} label="Users" to="/admin/users" active={currentPath === '/admin/users'} onClick={onClose} />
        <AdminSidebarItem icon={ShieldCheck} label="KYC Verification" to="/admin/kyc" active={currentPath === '/admin/kyc'} onClick={onClose} />
        <AdminSidebarItem icon={TrendingUp} label="Market Control" to="/admin/market-control" active={currentPath === '/admin/market-control'} onClick={onClose} />
        <AdminSidebarItem icon={History} label="Transactions" to="/admin/transactions" active={currentPath === '/admin/transactions'} onClick={onClose} />
        <AdminSidebarItem icon={RefreshCw} label="CRM Sync" to="/admin/crm-sync" active={currentPath === '/admin/crm-sync'} onClick={onClose} />
        <AdminSidebarItem icon={Settings} label="System Settings" to="/admin/settings" active={currentPath === '/admin/settings'} onClick={onClose} />
      </nav>

      <div className="mt-auto pt-4 border-t border-border-glass">
        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all mb-2">
           <LayoutDashboard size={18} />
           <span className="text-sm font-medium tracking-wide">Back to App</span>
        </Link>
        <div onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white cursor-pointer rounded-xl hover:bg-white/5 transition-all">
          <LogOut size={18} className="text-rose-500" />
          <span className="text-sm font-medium tracking-wide">Logout</span>
        </div>
      </div>
    </aside>
  );
};
