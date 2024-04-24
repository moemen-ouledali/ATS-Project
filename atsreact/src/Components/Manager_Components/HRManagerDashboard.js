import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddJobListing from './AddJobListing';
import EditJobListing from './EditJobListing';
import ToastNotification from '../Extra_Components/ToastNotification';
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
            const response = await axios.get('http://localhost:5000/api/jobapplications/all');
            console.log(response.data); // Log all applicants to the console
        } catch (error) {
            console.error('Failed to fetch all applicants:', error);
        }
    };

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
            <button style={style.button} onClick={fetchAllApplications}>Show All Applications</button>
            <AddJobListing fetchJobListings={fetchJobListings} />
            {applications.length > 0 && applications.map((app, index) => (
                <div key={index}>
                    <p>Applicant: {app.applicantId.username} (Email: {app.applicantId.email})</p>
                    <p>Applied for: {app.jobId.title} at {app.jobId.company}</p>
                    <p>Resume Text: {app.resumeText}</p>
                    <hr />
                </div>
            ))}
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
