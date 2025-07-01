import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });


  // Check authentication status on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('Starting auth status check...');
      setIsLoading(true);
      
      const response = await api.get('/api/auth-status', { 
        timeout: 5000 // 5-second timeout
      });
      
      console.log('Auth Status Response:', response.data);
      
      if (response.data.isAuthenticated) {
        console.log('User is authenticated');
        setUser(response.data.user || null);
        setIsAuthenticated(true);
        setIsAdmin(response.data.isAdmin || false);
      } else {
        console.log('User is not authenticated');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Complete Auth Check Error:', {
        response: err.response,
        message: err.message,
        config: err.config
      });
      
      setError(err.response?.data?.message || err.message);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      console.log('Auth status check completed');
      setIsLoading(false);
    }
  }, []);


  // Initial auth check
  useEffect(() => {
    console.log('UserProvider mounted, checking auth status');
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login function
  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/api/login', { email, password });
      
      console.log('Login Response:', response.data);
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsAdmin(response.data.isAdmin || false);
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message);
      setIsAuthenticated(false);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/api/signup', userData);
      
      console.log('Signup Response:', response.data);
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsAdmin(false); // New signups are always regular users
      
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message);
      setIsAuthenticated(false);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/logout');
      
      console.log('Logout Response:', response.data);
      
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setIsLoading(true);
    try {
      const response = await api.get('/api/user');
      
      console.log('User Data Response:', response.data);
      
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('Error fetching user data:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.put('/api/update-profile', userData);
      
      console.log('Update Profile Response:', response.data);
      
      setUser(response.data.user);
      
      return { success: true, user: response.data.user };
    } catch (err) {
      console.error('Update profile error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login,
    signup,
    logout,
    fetchUserData,
    updateProfile,
    checkAuthStatus
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};