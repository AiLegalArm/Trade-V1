import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthLayout } from './pages/auth/AuthLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProfileSettings } from './pages/dashboard/ProfileSettings';
import { Portfolio } from './pages/dashboard/Portfolio';
import { Gamification } from './pages/dashboard/Gamification';
import { Academy } from './pages/dashboard/Academy';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useMarketEngine } from './hooks/useMarketEngine';
import { Markets } from './pages/dashboard/Markets';
import { Trade } from './pages/dashboard/Trade';
import { Transactions } from './pages/dashboard/Transactions';
import { Referrals } from './pages/dashboard/Referrals';
import { KYC } from './pages/dashboard/KYC';
import { Notifications } from './pages/dashboard/Notifications';
import { Support } from './pages/dashboard/Support';

const AppContent = () => {
  useMarketEngine();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/support" element={<Support />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
