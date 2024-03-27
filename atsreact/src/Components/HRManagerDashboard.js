import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListing from './AddJobListing';
import EditJobListing from './EditJobListing';
import ToastNotification from './ToastNotification';
import { useNavigate } from 'react-router-dom';

const HRManagerDashboard = () => {
    const [jobListings, setJobListings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

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
        navigate(`/job-applicants/${jobId}`);
    };

    const fetchAllApplications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jobapplications/all-details');
            setApplications(response.data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        }
    };

    const fetchAllApplicants = async () => {
        try {
            // Example API endpoint: change this URL to wherever your backend endpoint is located
            const response = await axios.get('http://localhost:5000/api/jobapplications/all');
            console.log(response.data); // This will log all applicants to the console; modify as needed to display in UI
            // You might want to set this data to a state variable and map over it to display each applicant's details
        } catch (error) {
            console.error('Failed to fetch all applicants:', error);
            // Handle error (e.g., set an error message state and display it)
        }
    };

    // Inline CSS styles
    const style = {
        container: { padding: '20px' },
        jobListing: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
        title: { color: '#333', fontWeight: 'bold' },
        button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer' },
        editButton: { backgroundColor: 'lightblue' },
        deleteButton: { backgroundColor: 'salmon', color: 'white' },
        showApplicantsButton: { backgroundColor: 'lightgreen' },
        showAllApplicantsButton: { backgroundColor: 'lightcoral' } // New button style
    };


    return (
        <div style={style.container}>
            <h2>Welcome HR Manager</h2>
            <button style={{...style.button, ...style.showAllApplicantsButton}} onClick={fetchAllApplications}>Show All Applicants</button>
            <AddJobListing fetchJobListings={fetchJobListings} />
            {applications.length > 0 && (
                <div>
                    <h3>All Applications</h3>
                    {applications.map((app, index) => (
                        <div key={index}>
                            <p>Applicant: {app.applicantId.username} (Email: {app.applicantId.email})</p>
                            <p>Applied for: {app.jobId.title} at {app.jobId.company}</p>
                            <p>Resume Text: {app.resumeText}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
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
            <button style={style.button} onClick={fetchAllApplicants}>Show All Applicants</button>
            {showToast && <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />}
        </div>
    );
};




export default HRManagerDashboard;
