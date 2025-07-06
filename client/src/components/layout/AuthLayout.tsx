import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FastBite Pro</h1>
            <p className="text-gray-600">Multi-Platform Food Delivery System</p>
          </div>
          <LoginForm onSuccess={() => setShowLogin(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">FastBite Pro</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user?.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName || user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  setShowLogin(true);
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
}