import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListing from './AddJobListing'; // Make sure this path is correct
import EditJobListing from './EditJobListing'; // Make sure this path is correct

const HRManagerDashboard = () => {
    const [jobListings, setJobListings] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchJobListings();
    }, []);

    const fetchJobListings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/joblistings');
            setJobListings(response.data);
        } catch (error) {
            console.error('Failed to fetch job listings:', error);
        }
    };

    const deleteJobListing = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/joblistings/${id}`);
            fetchJobListings();
        } catch (error) {
            console.error('Failed to delete job listing:', error);
        }
    };

    const handleEditClick = (id) => {
        setEditingId(id);
    };

    const handleSave = async (id, updatedListing) => {
        try {
            await axios.put(`http://localhost:5000/api/joblistings/${id}`, updatedListing);
            fetchJobListings();
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update job listing:', error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    return (
        <div>
            <h2>Welcome HR MANAGER</h2>
            <AddJobListing fetchJobListings={fetchJobListings} />
            <div>
                <h3>Current Job Postings</h3>
                {jobListings.length > 0 ? (
                    jobListings.map((listing) => (
                        <div key={listing._id}>
                            {editingId === listing._id ? (
                                <EditJobListing
                                    listing={listing}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            ) : (
                                <div>
                                    <h4>{listing.title} at {listing.company}</h4>
                                    <p>{listing.description}</p>
                                    <button onClick={() => handleEditClick(listing._id)}>Edit</button>
                                    <button onClick={() => deleteJobListing(listing._id)}>Delete</button>
                                </div>
                            )}
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
