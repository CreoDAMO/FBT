import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/lib/protected-route';
import AuthLayout from '@/components/layout/AuthLayout';
import MainLayout from '@/components/layout/MainLayout';
import AuthPage from '@/pages/auth-page';
import Dashboard from '@/pages/Dashboard';
import OrderSystem from '@/pages/OrderSystem';
import DriverPortal from '@/pages/DriverPortal';
import MerchantHub from '@/pages/MerchantHub';
import Crowdfunding from '@/pages/Crowdfunding';
import Tokenomics from '@/pages/Tokenomics';
import SmartContracts from '@/pages/SmartContracts';
import AdminPanel from '@/pages/AdminPanel';
import UserManagement from '@/pages/UserManagement';
import Compliance from '@/pages/Compliance';
import Analytics from '@/pages/Analytics';
import InvestorDashboard from '@/pages/InvestorDashboard';
import AIStudio from '@/pages/AIStudio';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/auth" element={<AuthLayout><AuthPage /></AuthLayout>} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/orders" element={<OrderSystem />} />
                          <Route path="/driver" element={<DriverPortal />} />
                          <Route path="/merchant" element={<MerchantHub />} />
                          <Route path="/crowdfunding" element={<Crowdfunding />} />
                          <Route path="/tokenomics" element={<Tokenomics />} />
                          <Route path="/smart-contracts" element={<SmartContracts />} />
                          <Route path="/admin" element={<AdminPanel />} />
                          <Route path="/users" element={<UserManagement />} />
                          <Route path="/compliance" element={<Compliance />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/investor" element={<InvestorDashboard />} />
                          <Route path="/ai-studio" element={<AIStudio />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;