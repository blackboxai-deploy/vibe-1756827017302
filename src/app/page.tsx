"use client";


import { LoginScreen } from '@/components/auth/LoginScreen';
import { POSInterface } from '@/components/pos/POSInterface';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { usePOS } from '@/hooks/use-pos';

export default function Home() {
  const { authState, login, logout, isLoaded } = usePOS();

  // Show loading screen while data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Fusion Eats...</p>
        </div>
      </div>
    );
  }

  // Show appropriate interface based on authentication state
  if (!authState.isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  if (authState.userType === 'admin') {
    return <AdminDashboard onLogout={logout} />;
  }

  if (authState.userType === 'staff') {
    return <POSInterface onLogout={logout} />;
  }

  // Fallback - should not reach here
  return <LoginScreen onLogin={login} />;
}