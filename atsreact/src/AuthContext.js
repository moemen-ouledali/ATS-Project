import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create the AuthContext to provide authentication details and methods
export const AuthContext = createContext();









// AuthProvider component to wrap the application and provide auth context
export const AuthProvider = ({ children }) => {
    // Initial state setup for authentication details
    const [authDetails, setAuthDetails] = useState({
        authToken: localStorage.getItem('token'), // Fetch token from localStorage
        userRole: localStorage.getItem('role'),   // Fetch user role from localStorage
        userId: localStorage.getItem('userId'),   // Fetch user ID from localStorage
        userDetails: {
            fullName: localStorage.getItem('fullName') || '',   // Fetch full name from localStorage
            email: localStorage.getItem('email') || '',         // Fetch email from localStorage
            phoneNumber: localStorage.getItem('phoneNumber') || '' // Fetch phone number from localStorage
        }
    });












    // Function to update auth context from localStorage
    const updateAuthContextFromStorage = useCallback(() => {
        console.log("Updating Auth Context from local storage...");
        setAuthDetails({
            authToken: localStorage.getItem('token'), // Update token
            userRole: localStorage.getItem('role'),   // Update role
            userId: localStorage.getItem('userId'),   // Update user ID
            userDetails: {
                fullName: localStorage.getItem('fullName') || '', // Update full name
                email: localStorage.getItem('email') || '',       // Update email
                phoneNumber: localStorage.getItem('phoneNumber') || '' // Update phone number
            }
        });
    }, []);










    // useEffect to set initial auth context and handle storage changes
    useEffect(() => {
        updateAuthContextFromStorage(); // Initial update from storage

        // Event listener for storage changes to update auth context
        const handleStorageChange = () => updateAuthContextFromStorage();
        window.addEventListener('storage', handleStorageChange);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [updateAuthContextFromStorage]);
















    // Function to set token and role in localStorage and update auth context
    const setTokenAndRole = (token, role, userId, fullName, email, phoneNumber) => {
        localStorage.setItem('token', token);           // Save token to localStorage
        localStorage.setItem('role', role);             // Save role to localStorage
        localStorage.setItem('userId', userId);         // Save user ID to localStorage
        localStorage.setItem('fullName', fullName);     // Save full name to localStorage
        localStorage.setItem('email', email);           // Save email to localStorage
        localStorage.setItem('phoneNumber', phoneNumber); // Save phone number to localStorage










        



        // Update auth context with new details
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






    // Function to clear auth details from localStorage and reset auth context
    const logout = () => {
        localStorage.clear(); // Clear all localStorage items

        // Reset auth details
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
        // Provide auth details and methods to the context
        <AuthContext.Provider value={{ ...authDetails, setTokenAndRole, logout }}>
            {children}
        </AuthContext.Provider>
    );
};





export default AuthProvider;
