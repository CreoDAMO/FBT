import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Handle OAuth redirect with token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (token && success) {
      // Store token and redirect to dashboard
      localStorage.setItem('authToken', token);
      // Parse user data from JWT (in production, validate server-side)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify(payload));
        setLocation('/dashboard');
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    } else if (error) {
      console.error('OAuth error:', error);
    }
  }, [setLocation]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return <LoginForm />;
}