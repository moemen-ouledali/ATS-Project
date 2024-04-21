import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

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

    useEffect(() => {
        const updateAuthContextFromStorage = () => {
            console.log("Updating AuthContext from localStorage...");
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
        };

        // Initial update from storage
        updateAuthContextFromStorage();

        // Listener for local storage changes
        window.addEventListener('storage', updateAuthContextFromStorage);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('storage', updateAuthContextFromStorage);
        };
    }, []);

    const setTokenAndRole = (token, role, userId, fullName, email, phoneNumber) => {
        console.log(`Setting credentials: userId = ${userId}`); // Debug log for userId
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
