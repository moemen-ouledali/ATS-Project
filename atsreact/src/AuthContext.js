import React, { useState, useEffect, useContext, useCallback, createContext  } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Ensure initial state setup includes all necessary user details
    const [authDetails, setAuthDetails] = useState({
        authToken: localStorage.getItem('token'),
        userRole: localStorage.getItem('role'),
        userId: localStorage.getItem('userId'), // Make sure this is correctly retrieved
        userDetails: {
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phoneNumber: localStorage.getItem('phoneNumber') || ''
        }
    });

    useEffect(() => {
        const handleStorageChange = () => {
            console.log("Local storage changed, updating AuthContext...");
            updateAuthContextFromStorage();
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    // It's also useful to ensure that the update function does not redefine itself on every render
    const updateAuthContextFromStorage = useCallback(() => {
        setAuthDetails({
            authToken: localStorage.getItem('token'),
            userRole: localStorage.getItem('role'),
            userId: localStorage.getItem('userId'),
            userDetails: {
                fullName: localStorage.getItem('fullName') || '',
                email: localStorage.getItem('email') || '',
                phoneNumber: localStorage.getItem('phoneNumber') || ''
            }
        });
    }, []);
    

    const setTokenAndRole = (token, role, userId, fullName, email, phoneNumber) => {
        console.log(`Setting credentials: userId = ${userId}`); // Ensure this logs the correct userId after login
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', email);
        localStorage.setItem('phoneNumber', phoneNumber);
    
        setAuthDetails({
            authToken: token,
            userRole: role,
            userId: userId,
            userDetails: {
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber
            }
        });
    };
    

    const logout = () => {
        console.log("User logged out, clearing local storage and AuthContext");
        localStorage.clear();
        setAuthDetails({
            authToken: null,
            userRole: null,
            userId: null,
            userDetails: {
                fullName: '',
                email: '',
                phoneNumber: ''
            }
        });
    };

    const authContextValue = {
        ...authDetails,
        setTokenAndRole,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
