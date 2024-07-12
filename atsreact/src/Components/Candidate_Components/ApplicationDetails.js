// Importing necessary dependencies and hooks
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Adjust the import path as necessary










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Application Details Component
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ApplicationDetails = () => {
    const { id } = useParams(); // Get application ID from URL parameters
    const { authToken } = useContext(AuthContext); // Get authToken from AuthContext

    const [applicationDetails, setApplicationDetails] = useState(null); // State for storing application details
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(''); // State for error messages










    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Fetch Application Details
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                // Make an API request to fetch application details
                const response = await axios.get(`http://localhost:5000/api/applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}` // Include auth token in request headers
                    }
                });
                setApplicationDetails(response.data); // Set the fetched data to state
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                setError('Failed to fetch application details'); // Set error message in case of failure
                setLoading(false); // Set loading to false in case of error
                console.error(err); // Log the error to console
            }
        };

        fetchApplicationDetails(); // Call the function to fetch application details
    }, [id, authToken]); // Dependency array for useEffect, triggers effect when id or authToken changes











    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Conditional Rendering Based on State
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (loading) {
        return <p>Loading application details...</p>; // Show loading message while fetching data
    }

    if (error) {
        return <p>{error}</p>; // Show error message if there was an error fetching data
    }

    if (!applicationDetails) {
        return <p>No details found for this application.</p>; // Show message if no application details are found
    }











    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Render Application Details
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div style={{ padding: '20px' }}> {/* Container for application details */}
            <h1>Application Details</h1> {/* Title */}
            {/* Display application details */}
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

export default ApplicationDetails; // Exporting the component
