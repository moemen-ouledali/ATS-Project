import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userDetails, setUserDetails] = useState({
    fullName: localStorage.getItem('fullName') || '',
    email: localStorage.getItem('email') || '',
    phoneNumber: localStorage.getItem('phoneNumber') || ''
  });

  // Function to update context based on local storage values
  const updateAuthContextFromStorage = () => {
    console.log("Updating Auth Context from Storage");
    setAuthToken(localStorage.getItem('token'));
    setUserRole(localStorage.getItem('role'));
    setUserId(localStorage.getItem('userId'));
    setUserDetails({
      fullName: localStorage.getItem('fullName') || '',
      email: localStorage.getItem('email') || '',
      phoneNumber: localStorage.getItem('phoneNumber') || ''
    });
    console.log("Updated userDetails:", userDetails);
  };

  useEffect(() => {
    updateAuthContextFromStorage(); // Initial update from storage

    // Listener for local storage changes
    window.addEventListener('storage', updateAuthContextFromStorage);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', updateAuthContextFromStorage);
    };
  }, []);

  const setTokenAndRole = (token, role, id, fullName, email, phoneNumber) => {
    console.log("Setting token, role, and user details");
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', id);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('email', email);
    localStorage.setItem('phoneNumber', phoneNumber);

    updateAuthContextFromStorage(); // Update context after setting local storage
  };

  const logout = () => {
    console.log("Logging out and clearing local storage");
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');

    updateAuthContextFromStorage(); // Update context after clearing local storage
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

export default AuthProvider;
