import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubConfig, setGithubConfig] = useState({ username: 'ramcharan2122', repo: 'ramcharan2122/my-animated-website', isConnected: true });

  useEffect(() => {
    const token = localStorage.getItem('shadowboard_token');
    if (token) {
      api.getMe()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('shadowboard_token');
          localStorage.removeItem('shadowboard_current_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    api.getGithubConfig()
      .then((cfg) => {
        if (cfg) setGithubConfig(cfg);
      })
      .catch((e) => console.warn('Error loading GH config:', e));
  }, []);

  const initiateLogin = async (email, password) => {
    return await api.requestOtp(email, password);
  };

  const verifyOtp = async (email, otpCode) => {
    const res = await api.verifyOtp(email, otpCode);
    localStorage.setItem('shadowboard_token', res.token);
    setUser(res.user);
    return res;
  };

  const login = async (email, password) => {
    return await initiateLogin(email, password);
  };

  const loginWithGithub = async (usernameOrToken = 'ramcharan2122') => {
    const res = await api.loginWithGithubAccount(usernameOrToken);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    return await api.register(userData);
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    localStorage.setItem('shadowboard_token', res.token);
    setUser(res.user);
    return res;
  };

  const saveGithubConfig = async (config) => {
    const res = await api.saveGithubConfig(config);
    setGithubConfig(res.config);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('shadowboard_token');
    localStorage.removeItem('shadowboard_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        initiateLogin,
        verifyOtp,
        loginWithGithub,
        register,
        demoLogin,
        logout,
        githubConfig,
        saveGithubConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
