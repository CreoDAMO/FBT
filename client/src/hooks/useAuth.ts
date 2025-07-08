import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  authProvider?: 'email' | 'google' | 'facebook' | 'metamask' | 'coinbase';
}

interface AuthError {
  message: string;
  code?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: { message: data.message } };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: { message: 'Network error occurred' } };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      window.location.href = '/api/auth/google';
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: { message: 'Failed to initiate Google login' } };
    }
  };

  const loginWithFacebook = async (): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      window.location.href = '/api/auth/facebook';
      return { success: true };
    } catch (error) {
      console.error('Facebook login error:', error);
      return { success: false, error: { message: 'Failed to initiate Facebook login' } };
    }
  };

  const loginWithMetaMask = async (): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        return { success: false, error: { message: 'MetaMask is not installed' } };
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        return { success: false, error: { message: 'No accounts found' } };
      }

      const walletAddress = accounts[0];
      const response = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress, 
          provider: 'metamask' 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: { message: data.message } };
      }
    } catch (error) {
      console.error('MetaMask login error:', error);
      return { success: false, error: { message: 'Failed to connect with MetaMask' } };
    }
  };

  const loginWithCoinbase = async (): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      return { success: false, error: { message: 'Coinbase Wallet login coming soon' } };
    } catch (error) {
      console.error('Coinbase login error:', error);
      return { success: false, error: { message: 'Failed to connect with Coinbase Wallet' } };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        return { success: true };
      } else {
        return { success: false, error: { message: data.message } };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: { message: 'Registration failed' } };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: { message: data.message } };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: { message: 'Failed to send reset email' } };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: { message: data.message } };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: { message: 'Failed to reset password' } };
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithMetaMask,
    loginWithCoinbase,
    logout,
    register,
    forgotPassword,
    resetPassword,
  };
}
