// src/Components/Manager_Components/HRManagerDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListingModal from './AddJobListingModal';
import EditJobListing from './EditJobListing';
import ToastNotification from '../Extra_Components/ToastNotification';
import { useNavigate } from 'react-router-dom';

const HRManagerDashboard = () => {
    const [jobListings, setJobListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobListings();
    }, []);

    const fetchJobListings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jobs');
            setJobListings(response.data);
        } catch (error) {
            console.error('Failed to fetch job listings:', error);
        }
    };

    const deleteJobListing = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${id}`);
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
            await axios.put(`http://localhost:5000/api/jobs/${id}`, updatedListing);
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
        navigate(`/job-applicants/${jobId}`);
    };

    const showAllApplications = () => {
        navigate('/all-applications');
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const style = {
        container: { padding: '20px' },
        jobListing: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
        title: { color: '#333', fontWeight: 'bold' },
        button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer' },
        editButton: { backgroundColor: 'lightblue' },
        deleteButton: { backgroundColor: 'salmon', color: 'white' },
        showApplicantsButton: { backgroundColor: 'lightgreen' },
    };

    return (
        <div style={style.container}>
            <h2>Welcome HR Manager</h2>
            <button style={style.button} onClick={showAllApplications}>Show All Applications</button>
            <button style={style.button} onClick={handleShowModal}>Add Job Listing</button>
            <AddJobListingModal show={showModal} handleClose={handleCloseModal} fetchJobListings={fetchJobListings} />
            {jobListings.map((listing) => (
                <div key={listing._id} style={style.jobListing}>
                    {editingId === listing._id ? (
                        <EditJobListing listing={listing} onSave={handleSave} onCancel={handleCancel} />
                    ) : (
                        <>
                            <h4 style={style.title}>{listing.title} at {listing.company}</h4>
                            <p>{listing.description}</p>
                            <button style={style.editButton} onClick={() => handleEditClick(listing._id)}>Edit</button>
                            <button style={style.deleteButton} onClick={() => deleteJobListing(listing._id)}>Delete</button>
                            <button style={style.showApplicantsButton} onClick={() => showApplicants(listing._id)}>Show Applicants</button>
                        </>
                    )}
                </div>
            ))}
            {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
        </div>
    );
};

export default HRManagerDashboard;
