import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, try to auto-login from stored token
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('naam_upchar_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        if (data.success) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem('naam_upchar_token');
        localStorage.removeItem('naam_upchar_user');
      } finally {
        setLoading(false);
      }
    };
    autoLogin();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('naam_upchar_token', token);
    localStorage.setItem('naam_upchar_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('naam_upchar_token');
    localStorage.removeItem('naam_upchar_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('naam_upchar_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
