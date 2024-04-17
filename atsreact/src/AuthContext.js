import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext({
    authToken: null,  // Set initial default values for authentication token
    userRole: null,   // User role (e.g., 'manager', 'candidate')
    userId: null,     // User ID
    userDetails: {    // User details object
        fullName: '',
        email: '',
        phoneNumber: ''
    },
    setTokenAndRole: () => {}, // Function to set the token and user role
    logout: () => {},          // Function to handle logout
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
        console.log("Updating Auth Context from Storage");
        setAuthToken(localStorage.getItem('token'));
        setUserRole(localStorage.getItem('role'));
        setUserId(localStorage.getItem('userId'));
        setUserDetails({
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phoneNumber: localStorage.getItem('phoneNumber') || ''
        });
    }, []);

    useEffect(() => {
        updateAuthContextFromStorage(); // Initial update from storage
        window.addEventListener('storage', updateAuthContextFromStorage); // Listener for local storage changes
        return () => {
            window.removeEventListener('storage', updateAuthContextFromStorage); // Cleanup listener
        };
    }, [updateAuthContextFromStorage]);

    const setTokenAndRole = (token, role, id, fullName, email, phoneNumber) => {
        console.log("Role from login:", role);  // Log the role as it is set during the login process
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', email);
        localStorage.setItem('phoneNumber', phoneNumber);
        updateAuthContextFromStorage(); // This triggers the context update
        console.log("Auth context updated with:", { token, role, id, fullName, email, phoneNumber });
    };
    

    const logout = () => {
        console.log("Logging out and clearing local storage");
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
