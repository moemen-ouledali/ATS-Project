// atsreact/src/Components/Candidate_Components/CandidateDashboard.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Accessing the AuthContext to get the authToken and user email
    const { authToken, userDetails } = useContext(AuthContext);

    // Define the function to fetch applications with useCallback
    const fetchApplications = useCallback(async () => {
        setLoading(true);  // Ensure to set loading to true at the start of the fetch
        try {
            const response = await axios.get('http://localhost:5000/api/applications', {
                headers: {
                    Authorization: `Bearer ${authToken}`  // Make sure authToken is valid and properly set
                },
                params: {
                    email: userDetails.email
                }
            });

            setApplications(response.data);
            setLoading(false);  // Set loading to false upon successful fetch
        } catch (err) {
            setError('Failed to fetch applications');
            setLoading(false);  // Ensure loading is set to false even on error
            console.error(err);
        }
    }, [authToken, userDetails.email]);  // authToken and email are dependencies of useCallback

    // useEffect to call fetchApplications when component mounts or fetchApplications changes
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Function to render applications
    function renderApplications() {
        if (applications.length === 0) {
            return <p>No applications found.</p>;
        }

        return (
            <ul>
                {applications.map(app => (
                    <li key={app._id}>
                        <h2>{app.jobId.title} - {app.status}</h2>
                        <p>Company: {app.jobId.company}</p>
                        <p>Date Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                        <p>Status: {app.status}</p>
                        <button onClick={() => navigate(`/application/${app._id}`)}>View Details</button>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Your Applications</h1>
            {loading ? (
                <p>Loading applications...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                renderApplications()
            )}
        </div>
    );
};

export default CandidateDashboard;
