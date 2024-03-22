import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListing from './AddJobListing'; // Adjust the path as necessary

const HRManagerDashboard = () => {
    const [jobListings, setJobListings] = useState([]);

    useEffect(() => {
        fetchJobListings();
    }, []);

    const fetchJobListings = async () => {
        try {
            // Adjust this URL to your backend's job listings endpoint
            const response = await axios.get('http://localhost:5000/api/joblistings');
            setJobListings(response.data);
        } catch (error) {
            console.error('Failed to fetch job listings:', error);
        }
    };

    const deleteJobListing = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/joblistings/${id}`);
            // Refresh the job listings to reflect the deletion
            fetchJobListings();
        } catch (error) {
            console.error('Failed to delete job listing:', error);
        }
    };

    return (
        <div>
            <h2>Welcome HR MANAGER</h2>
            <AddJobListing /> {/* This line adds the job listing form to the HR Manager's Dashboard */}
            <div>
                <h3>Current Job Postings</h3>
                {jobListings.length > 0 ? (
                    jobListings.map((listing) => (
                        <div key={listing._id}>
                            <h4>{listing.title} at {listing.company}</h4>
                            <p>{listing.description}</p>
                            {/* Update and Delete operations now have functionality */}
                            <button>Edit</button> {/* Placeholder for future implementation */}
                            <button onClick={() => deleteJobListing(listing._id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No job listings found.</p>
                )}
            </div>
        </div>
    );
};

export default HRManagerDashboard;
