import { LoaderCircle } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#080b13] text-cyan-200"><LoaderCircle size={24} className="animate-spin" aria-label="Checking authentication" /></main>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
