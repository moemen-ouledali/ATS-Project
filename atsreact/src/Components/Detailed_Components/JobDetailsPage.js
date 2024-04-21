import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, Alert } from '@mui/material';
import { AuthContext } from '../../AuthContext'; // Ensure the path is correct
import JobApplicationForm from './JobApplicationForm'; // Import JobApplicationForm component

const JobDetailsPage = () => {
    const { id } = useParams(); // This is the jobID
    const { userDetails } = useContext(AuthContext); // Use AuthContext to get userDetails
    const [jobDetails, setJobDetails] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [userAuthorized, setUserAuthorized] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJobDetails(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };
        fetchJobDetails();
    }, [id]);

    useEffect(() => {
        // Check if userDetails are available and user is logged in
        if (userDetails && userDetails.userId) {
            setUserAuthorized(true);
        } else {
            setUserAuthorized(false);
        }
    }, [userDetails]);

    const toggleFormVisibility = useCallback(() => {
        if (userAuthorized) {
            setShowForm(!showForm);
        } else {
            alert('You must be logged in to apply for a job.');
        }
    }, [userAuthorized, showForm]);

    return (
        <div>
            <Typography variant="h4" style={{ marginBottom: 20 }}>
                Apply for {jobDetails.title || 'the position'}
            </Typography>
            <Typography variant="h6">
                {jobDetails.description || 'No description available'}
            </Typography>
            <Button variant="contained" color="primary" onClick={toggleFormVisibility}>
                Apply Now
            </Button>
            {showForm && (
                <JobApplicationForm jobId={id} />
            )}
            {!userAuthorized && (
                <Alert severity="error" style={{ marginTop: 20 }}>
                    You need to log in to apply.
                </Alert>
            )}
        </div>
    );
};

export default JobDetailsPage;
