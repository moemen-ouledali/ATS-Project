import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext({
<<<<<<< HEAD
<<<<<<< HEAD
    authToken: null,  // Initial default values for authentication token
    userRole: null,   // User role (e.g., 'manager', 'candidate')
    userId: null,     // User ID
    userDetails: {    // User details object
=======
=======
>>>>>>> parent of af34368 (test navbar)
    authToken: null, // Set initial default values for authentication token
    userRole: null, // User role (e.g., 'manager', 'candidate')
    userId: null, // User ID
    userDetails: { // User details object
<<<<<<< HEAD
>>>>>>> parent of af34368 (test navbar)
=======
>>>>>>> parent of af34368 (test navbar)
        fullName: '',
        email: '',
        phoneNumber: ''
    },
    setTokenAndRole: () => {}, // Function to set the token and user role
    logout: () => {}, // Function to handle logout
    updateAuthContextFromStorage: () => {} // Function to update context from local storage
});

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [userDetails, setUserDetails] = useState({
        fullName: localStorage.getItem('fullName') || '',
        email: localStorage.getItem('email') || '',
        phoneNumber: localStorage.getItem('phoneNumber') || ''
    });

    const updateAuthContextFromStorage = useCallback(() => {
        console.log("Updating Auth Context from local storage...");
        setAuthToken(localStorage.getItem('token'));
        setUserRole(localStorage.getItem('role'));
        setUserId(localStorage.getItem('userId'));
        setUserDetails({
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phoneNumber: localStorage.getItem('phoneNumber') || ''
        });
        console.log("Updated Auth Context:", { authToken, userRole, userId, userDetails });
    }, [authToken, userRole, userId, userDetails]);

    useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
        console.log("Setting up AuthContext with initial values...");
=======
      console.log('Checking storage update:');

>>>>>>> parent of af34368 (test navbar)
=======
      console.log('Checking storage update:');

>>>>>>> parent of af34368 (test navbar)
        updateAuthContextFromStorage(); // Initial update from storage
        // Listener for local storage changes
        window.addEventListener('storage', updateAuthContextFromStorage);
        // Cleanup listener on component unmount
        return () => {
<<<<<<< HEAD
<<<<<<< HEAD
            window.removeEventListener('storage', updateAuthContextFromStorage); // Cleanup listener
            console.log("Cleaning up listeners in AuthContext...");
=======
            window.removeEventListener('storage', updateAuthContextFromStorage);
>>>>>>> parent of af34368 (test navbar)
=======
            window.removeEventListener('storage', updateAuthContextFromStorage);
>>>>>>> parent of af34368 (test navbar)
        };
    }, [updateAuthContextFromStorage]);

    const setTokenAndRole = (token, role, id, fullName, email, phoneNumber) => {
<<<<<<< HEAD
<<<<<<< HEAD
        console.log("Setting token and role from login/register:", { token, role, id, fullName, email, phoneNumber });
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', email);
        localStorage.setItem('phoneNumber', phoneNumber);
        updateAuthContextFromStorage(); // This triggers the context update
    };
=======
=======
>>>>>>> parent of af34368 (test navbar)
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('email', email);
      localStorage.setItem('phoneNumber', phoneNumber);
  
      // Immediately update context states
      setAuthToken(token);
      setUserRole(role);
      setUserId(id);
      setUserDetails({ fullName, email, phoneNumber });
  };
  
<<<<<<< HEAD
>>>>>>> parent of af34368 (test navbar)
=======
>>>>>>> parent of af34368 (test navbar)

    const logout = () => {
        console.log("Logging out and clearing local storage...");
        localStorage.clear(); // Clears all local storage items
        setAuthToken(null);
        setUserRole(null);
        setUserId(null);
        setUserDetails({
            fullName: '',
            email: '',
            phoneNumber: ''
        });
    };

    const authContextValue = {
        authToken,
        userRole,
        userId,
        userDetails,
        setTokenAndRole,
        logout,
        updateAuthContextFromStorage
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
