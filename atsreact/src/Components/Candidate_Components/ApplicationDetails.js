// atsreact/src/Components/Candidate_Components/ApplicationDetails.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Adjust the import path as necessary

const ApplicationDetails = () => {
    const { id } = useParams(); // Get application ID from URL parameters
    const { authToken } = useContext(AuthContext); // Get authToken from AuthContext
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setApplicationDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch application details');
                setLoading(false);
                console.error(err);
            }
        };

        fetchApplicationDetails();
    }, [id, authToken]);

    if (loading) {
        return <p>Loading application details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!applicationDetails) {
        return <p>No details found for this application.</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Application Details</h1>
            <p><strong>Name:</strong> {applicationDetails.name}</p>
            <p><strong>Email:</strong> {applicationDetails.email}</p>
            <p><strong>Phone:</strong> {applicationDetails.phone}</p>
            <p><strong>Education Level:</strong> {applicationDetails.educationLevel}</p>
            <p><strong>Experience Level:</strong> {applicationDetails.experienceLevel}</p>
            <p><strong>University:</strong> {applicationDetails.university}</p>
            <p><strong>Motivation Letter:</strong> {applicationDetails.motivationLetter}</p>
            <p><strong>Status:</strong> {applicationDetails.status}</p>
        </div>
    );
};

export default ApplicationDetails;
