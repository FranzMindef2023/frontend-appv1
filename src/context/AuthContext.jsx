import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { useAxios } from '@/context/AxiosContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { api } = useAxios();

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [loggedIn, setLoggedIn] = useState(!!token);

  useEffect(() => {
    if (user && token) {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.clear();
    }
  }, [user, token]);

  const loginUser = async (values) => {
    try {
      const response = await authService.login(values);
      if (response.data.status) {
        const { access_token, post } = response.data;
        setUser(post);
        setToken(access_token);
        setLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setLoggedIn(false);
      sessionStorage.clear();
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const getProfile = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Profile error:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loggedIn, loginUser, logoutUser, registerUser, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
