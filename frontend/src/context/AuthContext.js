import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      const freshUser = response.data.user;
      setUser({
        id: freshUser.id || freshUser._id,
        _id: freshUser._id,
        fullName: freshUser.fullName,
        email: freshUser.email,
        role: freshUser.role
      });
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('token', response.data.token);
    const loggedInUser = response.data.user;
    setUser({
      id: loggedInUser.id || loggedInUser._id,
      _id: loggedInUser._id,
      fullName: loggedInUser.fullName,
      email: loggedInUser.email,
      role: loggedInUser.role
    });
    return response.data;
  };

  const register = async (fullName, email, password, role) => {
    const response = await authAPI.register({ fullName, email, password, role });
    localStorage.setItem('token', response.data.token);
    const registeredUser = response.data.user;
    setUser({
      id: registeredUser.id || registeredUser._id,
      _id: registeredUser._id,
      fullName: registeredUser.fullName,
      email: registeredUser.email,
      role: registeredUser.role
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const response = await authAPI.updateProfile(data);
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
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
