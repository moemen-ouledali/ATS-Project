import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfileForm = () => {
    const userId = localStorage.getItem('userId');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState({
        username: false,
        email: false,
        password: false,
    });

    useEffect(() => {
        if (userId) {
            console.log(`Attempting to fetch details for userId: ${userId}`); // Log the userId being used
            const fetchUserDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/auth/user/${userId}`);
                    console.log('User details fetched:', response.data); // Log the fetched data
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                    setMessage('Failed to load user details. Please try again.');
                }
            };
            fetchUserDetails();
        } else {
            setMessage('No user ID found. Please log in again.');
        }
    }, [userId]);

    const toggleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('No user ID found. Please log in again.');
            return;
        }
        try {
            const payload = {
                username: isEditing.username ? username : undefined,
                email: isEditing.email ? email : undefined,
                password: isEditing.password ? password : undefined
            };
            const response = await axios.put(`http://localhost:5000/auth/user/${userId}`, payload);
            if (response.data) {
                setMessage('Profile updated successfully.');
                setIsEditing({
                    username: false,
                    email: false,
                    password: false,
                });
            } else {
                setMessage('Profile updated, but no message received from the server.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile. Please try again.');
        }
    };

    return (
        <div>
            <h2>Edit Profile</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!isEditing.username}
                    />
                    <button type="button" onClick={() => toggleEdit('username')}>Edit</button>
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing.email}
                    />
                    <button type="button" onClick={() => toggleEdit('email')}>Edit</button>
                </div>
                <div>
                    <label htmlFor="password">New Password (leave blank if unchanged):</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!isEditing.password}
                    />
                    <button type="button" onClick={() => toggleEdit('password')}>Edit</button>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfileForm;
