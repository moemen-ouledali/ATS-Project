import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button } from '@mui/material';
import { AuthContext } from '../../AuthContext'; // Ensure the path is correct
import JobApplicationForm from './JobApplicationForm'; // Import JobApplicationForm component

const JobDetailsPage = () => {
    const { id } = useParams(); // This is the jobID
    const { userDetails } = useContext(AuthContext); // Use AuthContext to get userDetails
    const [jobDetails, setJobDetails] = useState({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        console.log("User Details on JobDetailsPage load:", userDetails);
    }, [userDetails]);

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

    const toggleFormVisibility = () => setShowForm(!showForm);

    return (
        <div>
            <Typography variant="h4" style={{ marginBottom: 20 }}>Apply for {jobDetails.title || 'the position'}</Typography>
            <Typography variant="h6">{jobDetails.description || 'No description available'}</Typography>
            {userDetails && userDetails.userId ? (
                <Button variant="contained" color="primary" onClick={toggleFormVisibility}>Apply Now</Button>
            ) : (
                <Typography variant="body1" style={{ color: 'red', marginTop: '20px' }}>You need to log in to apply.</Typography>
            )}
            {showForm && <JobApplicationForm jobId={id} />}
        </div>
    );
};

export default JobDetailsPage;
