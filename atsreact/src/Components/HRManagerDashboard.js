import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListing from './AddJobListing';
import EditJobListing from './EditJobListing';
import ToastNotification from './ToastNotification';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HRManagerDashboard = () => {
    const [jobListings, setJobListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

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
            setToastMessage('Job listing deleted successfully');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to delete job listing:', error);
            setToastMessage('Failed to delete job listing');
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
            setToastMessage('Job listing updated successfully');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to update job listing:', error);
            setToastMessage('Failed to update job listing');
            setShowToast(true);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const showApplicants = (jobId) => {
        navigate(`/job-applicants/${jobId}`); // Navigate to job applicants page for the given job ID
    };

    // Inline CSS styles
    const style = {
        container: { padding: '20px' },
        jobListing: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
        title: { color: '#333', fontWeight: 'bold' },
        button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer' },
        editButton: { backgroundColor: 'lightblue' },
        deleteButton: { backgroundColor: 'salmon', color: 'white' },
        showApplicantsButton: { backgroundColor: 'lightgreen' } // Add a new style for the show applicants button
    };

    return (
        <div style={style.container}>
            <h2>Welcome HR Manager</h2>
            <AddJobListing fetchJobListings={fetchJobListings} />
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
                                <button style={{...style.button, ...style.editButton}} onClick={() => handleEditClick(listing._id)}>Edit</button>
                                <button style={{...style.button, ...style.deleteButton}} onClick={() => deleteJobListing(listing._id)}>Delete</button>
                                <button style={{...style.button, ...style.showApplicantsButton}} onClick={() => showApplicants(listing._id)}>Show Applicants</button>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>No job listings found.</p>
            )}
            {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
        </div>
    );
};

export default HRManagerDashboard;
