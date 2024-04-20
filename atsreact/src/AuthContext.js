import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext({
    authToken: null,
    userRole: null,
    userId: null,
    userDetails: {
        fullName: '',
        email: '',
        phoneNumber: ''
    },
    setTokenAndRole: () => {},
    logout: () => {},
    updateAuthContextFromStorage: () => {}
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
    }, [setAuthToken, setUserRole, setUserId, setUserDetails]); // Corrected dependency array

    useEffect(() => {
        console.log('Checking storage update:');
        updateAuthContextFromStorage(); // Initial update from storage
        // Listener for local storage changes
        window.addEventListener('storage', updateAuthContextFromStorage);
        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('storage', updateAuthContextFromStorage);
        };
    }, [updateAuthContextFromStorage]);

    const setTokenAndRole = (token, role, id, fullName, email, phoneNumber) => {
        console.log("Setting credentials and updating local storage with new data");
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', email);
        localStorage.setItem('phoneNumber', phoneNumber);
        updateAuthContextFromStorage(); // This triggers the context update
    };
    
    const logout = () => {
        console.log("Logging out and clearing local storage");
        localStorage.clear();
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
