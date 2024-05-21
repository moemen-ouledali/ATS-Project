import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authDetails, setAuthDetails] = useState({
        authToken: localStorage.getItem('token'),
        userRole: localStorage.getItem('role'),
        userId: localStorage.getItem('userId'),
        userDetails: {
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phoneNumber: localStorage.getItem('phoneNumber') || ''
        }
    });

    const updateAuthContextFromStorage = useCallback(() => {
        console.log("Updating Auth Context from local storage...");
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

    useEffect(() => {
        updateAuthContextFromStorage(); // Initial update from storage
        const handleStorageChange = () => updateAuthContextFromStorage();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [updateAuthContextFromStorage]);

    const setTokenAndRole = (token, role, userId, fullName, email, phoneNumber) => {
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

        console.log("Updated Auth Details:", {
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

    return (
        <AuthContext.Provider value={{ ...authDetails, setTokenAndRole, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
