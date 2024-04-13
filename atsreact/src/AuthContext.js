import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userDetails, setUserDetails] = useState({
    fullName: localStorage.getItem('fullName'),
    email: localStorage.getItem('email'),
    phoneNumber: localStorage.getItem('phoneNumber')
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');

    if (token && role && id) {
      setAuthToken(token);
      setUserRole(role);
      setUserId(id);
      setUserDetails({ fullName, email, phoneNumber });
    }
  }, []);

  const setTokenAndRole = (token, role, id, fullName, email, phoneNumber) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', id);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('email', email);
    localStorage.setItem('phoneNumber', phoneNumber);

    setAuthToken(token);
    setUserRole(role);
    setUserId(id);
    setUserDetails({ fullName, email, phoneNumber });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');

    setAuthToken(null);
    setUserRole(null);
    setUserId(null);
    setUserDetails({});
  };

  const authContextValue = {
    authToken,
    userRole,
    userId,
    userDetails,
    setTokenAndRole,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
