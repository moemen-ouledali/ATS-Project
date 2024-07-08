import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Importing AuthContext to get the auth token

const ApplicationDetails = () => {






    const { id } = useParams(); // Getting the application ID from the URL
    const { authToken } = useContext(AuthContext); // Getting the authentication token from AuthContext
    const [applicationDetails, setApplicationDetails] = useState(null); // State to store application details
    const [loading, setLoading] = useState(true); // State to track if data is being loaded
    const [error, setError] = useState(''); // State to store any error messages





    // useEffect is a hook that runs a function when the component mounts or updates
    useEffect(() => {
        // Function to fetch application details from the server
        const fetchApplicationDetails = async () => {
            try {
                // Making a GET request to the server to get application details
                const response = await axios.get(`http://localhost:5000/api/applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}` // Adding the auth token to the request headers
                    }
                });
                // If the request is successful, update the state with the fetched data
                setApplicationDetails(response.data);
                setLoading(false); // Set loading to false since data has been fetched
            } 
            catch (err) {
                // If there's an error, update the error state
                setError('Failed to fetch application details');
                setLoading(false); // Set loading to false since there's an error
                console.error(err); // Log the error to the console
            }
        };

        // Call the function to fetch application details
        fetchApplicationDetails();
    }, [id, authToken]); // The effect depends on id and authToken, it will re-run if these change









    // If the data is still loading, show a loading message
    if (loading) {
        return <p>Loading application details...</p>;
    }



    // If there's an error, show the error message
    if (error) {
        return <p>{error}</p>;
    }



    // If no application details are found, show a message indicating this
    if (!applicationDetails) {
        return <p>No details found for this application.</p>;
    }










    // If data is fetched successfully, display the application details
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
