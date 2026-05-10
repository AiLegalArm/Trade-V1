import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminLayout } from './AdminLayout';

export const AdminRoute: React.FC = () => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check admin role
  const isAdmin = user?.user_metadata?.role === 'admin' || localStorage.getItem('role') === 'admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};
