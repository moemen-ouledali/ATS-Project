import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  // This effect runs once on component mount, thereby initializing authToken and userRole from localStorage.
  useEffect(() => {
    // Optionally, you can explicitly set authToken and userRole from localStorage here again
    // but it's redundant unless you expect localStorage to change after initial render.
  }, []);

  // Save the auth token and user role to state and local storage
  const setTokenAndRole = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuthToken(token);
    setUserRole(role);
  };

  // Clear the auth token and user role from state and local storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthToken(null);
    setUserRole(null);
  };

  // The context value that will be supplied to any descendants of this component
  const authContextValue = {
    authToken,
    userRole,
    setTokenAndRole,
    logout
  };

  // The provider component makes the auth context available to any child component that calls useContext(AuthContext)
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
