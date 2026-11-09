import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, storage } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from persistent storage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await storage.getItem('authToken');
        const storedUser = await storage.getItem('authUser');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              // Ignore parse error, will fetch fresh profile
            }
          }

          // Validate token with backend
          try {
            const res = await authApi.getProfile(storedToken);
            if (res.success && res.user) {
              setUser(res.user);
              await storage.setItem('authUser', JSON.stringify(res.user));
            }
          } catch {
            // Token expired or invalid
            await storage.removeItem('authToken');
            await storage.removeItem('authUser');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    if (data.success && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      await storage.setItem('authToken', data.token);
      await storage.setItem('authUser', JSON.stringify(data.user));
      return data.user;
    }
  };

  const register = async ({ name, email, password, role }) => {
    const data = await authApi.register({ name, email, password, role });
    if (data.success && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      await storage.setItem('authToken', data.token);
      await storage.setItem('authUser', JSON.stringify(data.user));
      return data.user;
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('authToken');
      await storage.removeItem('authUser');
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await authApi.getProfile(token);
      if (res.success && res.user) {
        setUser(res.user);
        await storage.setItem('authUser', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
