import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Include userId state

  const setTokenAndRole = (token, role, userId = null) => { // Accept userId as an argument
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (userId) {
      localStorage.setItem('userId', userId); // Store userId in localStorage
      setUserId(userId); // Update userId state
    }
    setAuthToken(token);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId'); // Clear userId from localStorage
    setAuthToken(null);
    setUserRole(null);
    setUserId(null); // Reset userId state
  };

  useEffect(() => {
    // This effect runs once on component mount to initialize state from localStorage
  }, []);

  const authContextValue = {
    authToken,
    userRole,
    userId, // Include userId in the context value
    setTokenAndRole,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
