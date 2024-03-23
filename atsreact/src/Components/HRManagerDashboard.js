import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListing from './AddJobListing'; // Adjust the import path as needed
import EditJobListing from './EditJobListing'; // Adjust the import path as needed
import ToastNotification from './ToastNotification'; // Adjust the import path as needed

const HRManagerDashboard = () => {
    const [jobListings, setJobListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

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
            setToastMessage('Job listing deleted successfully.');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to delete job listing:', error);
            setToastMessage('Failed to delete job listing.');
            setShowToast(true);
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
            setToastMessage('Job listing updated successfully.');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to update job listing:', error);
            setToastMessage('Failed to update job listing.');
            setShowToast(true);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    // Inline CSS styles
    const style = {
        container: { padding: '20px' },
        jobListing: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
        title: { color: '#333', fontWeight: 'bold' },
        button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer' },
        editButton: { backgroundColor: 'lightblue' },
        deleteButton: { backgroundColor: 'salmon', color: 'white' },
    };

    return (
        <div style={style.container}>
            <h2>Welcome HR MANAGER</h2>
            <AddJobListing fetchJobListings={fetchJobListings} />
            <div>
                <h3>Current Job Postings</h3>
                {jobListings.length > 0 ? (
                    jobListings.map((listing) => (
                        <div key={listing._id} style={style.jobListing}>
                            {editingId === listing._id ? (
                                <EditJobListing
                                    listing={listing}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            ) : (
                                <>
                                    <h4 style={style.title}>{listing.title} at {listing.company}</h4>
                                    <p>{listing.description}</p>
                                    <p>Location: {listing.location}</p>
                                    <p>Job Type: {listing.jobType}</p>
                                    <p>Requirements: {listing.requirements}</p>
                                    <p>Salary Range: {listing.salaryRange}</p>
                                    <p>Experience Level: {listing.experienceLevel}</p>
                                    <button style={{...style.button, ...style.editButton}} onClick={() => handleEditClick(listing._id)}>Edit</button>
                                    <button style={{...style.button, ...style.deleteButton}} onClick={() => deleteJobListing(listing._id)}>Delete</button>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No job listings found.</p>
                )}
            </div>
            {showToast && (
                <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />
            )}
        </div>
    );
};

export default HRManagerDashboard;
