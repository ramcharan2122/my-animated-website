import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shadowboard_token');
    if (token) {
      api.getMe()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('shadowboard_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('shadowboard_token', res.token);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('shadowboard_token', res.token);
    setUser(res.user);
    return res;
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    localStorage.setItem('shadowboard_token', res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('shadowboard_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
