import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Make sure the path to AuthContext is correct

const EditProfileForm = () => {
    const { userId, authToken } = useContext(AuthContext); // Using userId and authToken from AuthContext
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        dateOfBirth: '',
        highestEducationLevel: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setUserDetails({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    city: response.data.city,
                    dateOfBirth: response.data.dateOfBirth.split('T')[0], // Assuming date comes in ISO format
                    highestEducationLevel: response.data.highestEducationLevel
                });
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                alert('Failed to load your profile data.');
            }
        };

        fetchUserDetails();
    }, [userId, authToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/auth/user/${userId}`, userDetails, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(response => {
            alert('Profile updated successfully!');
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        });
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h1>Edit Your Profile</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="firstName" value={userDetails.firstName} onChange={handleChange} placeholder="First Name" required />
                <input type="text" name="lastName" value={userDetails.lastName} onChange={handleChange} placeholder="Last Name" required />
                <input type="email" name="email" value={userDetails.email} onChange={handleChange} placeholder="Email" required />
                <input type="text" name="phoneNumber" value={userDetails.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
                <input type="text" name="city" value={userDetails.city} onChange={handleChange} placeholder="City" required />
                <input type="date" name="dateOfBirth" value={userDetails.dateOfBirth} onChange={handleChange} required />
                <select name="highestEducationLevel" value={userDetails.highestEducationLevel} onChange={handleChange} required>
                    <option value="Baccalaureate">Baccalaureate</option>
                    <option value="Licence">Licence</option>
                    <option value="Engineering">Engineering</option>
                </select>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default EditProfileForm;
