// atsreact/src/Components/Manager_Components/JobApplicants.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const JobApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [jobTitle, setJobTitle] = useState('');
    const { jobId } = useParams();

    const fetchApplicants = useCallback(async () => {
        try {
            const [applicantsResponse, jobResponse] = await Promise.all([
                axios.get(`http://localhost:5000/api/applications/for-job/${jobId}`),
                axios.get(`http://localhost:5000/api/jobs/${jobId}`)
            ]);

            setApplicants(applicantsResponse.data);
            setJobTitle(jobResponse.data.title);
        } catch (error) {
            console.error('Failed to fetch applicants or job details:', error);
        }
    }, [jobId]); // Dependency array for useCallback

    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]); // Now fetchApplicants is stable and won't cause unnecessary rerenders

    const acceptApplication = async (appId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/accept/${appId}`);
            fetchApplicants(); // Refresh the list of applicants to show updated status
        } catch (error) {
            console.error('Failed to accept application:', error);
        }
    };

    const declineApplication = async (appId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/decline/${appId}`);
            fetchApplicants(); // Refresh the list of applicants to show updated status
        } catch (error) {
            console.error('Failed to decline application:', error);
        }
    };

    const showApplicationDetails = (applicant) => {
        setSelectedApplicant(applicant);
    };

    const closeApplicationDetails = () => {
        setSelectedApplicant(null);
    };

    const style = {
        container: { padding: '20px' },
        applicant: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
        button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer' },
        acceptButton: { backgroundColor: 'lightgreen' },
        declineButton: { backgroundColor: 'salmon', color: 'white' },
        detailsButton: { backgroundColor: 'lightblue' },
    };

    return (
        <div style={style.container}>
            <h2>Applicants for {jobTitle}</h2>
            {applicants.length === 0 ? (
                <p>No applicants for {jobTitle} at the current time.</p>
            ) : (
                applicants.map(applicant => (
                    <div key={applicant._id} style={style.applicant}>
                        <p><strong>Name:</strong> {applicant.name}</p>
                        <p><strong>Education Level:</strong> {applicant.educationLevel}</p>
                        <p><strong>Experience Level:</strong> {applicant.experienceLevel}</p>
                        <p><strong>Status:</strong> {applicant.status || 'In Review'}</p>
                        <p><strong>Applied on:</strong> {new Date(applicant.createdAt).toLocaleDateString()} {new Date(applicant.createdAt).toLocaleTimeString()}</p>
                        <button style={style.acceptButton} onClick={() => acceptApplication(applicant._id)}>Accept</button>
                        <button style={style.declineButton} onClick={() => declineApplication(applicant._id)}>Decline</button>
                        <button style={style.detailsButton} onClick={() => showApplicationDetails(applicant)}>View Details</button>
                    </div>
                ))
            )}
            {selectedApplicant && (
                <Modal show onHide={closeApplicationDetails}>
                    <Modal.Header closeButton>
                        <Modal.Title>Application Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Name:</strong> {selectedApplicant.name}</p>
                        <p><strong>Email:</strong> {selectedApplicant.email}</p>
                        <p><strong>Phone:</strong> {selectedApplicant.phone}</p>
                        <p><strong>Education Level:</strong> {selectedApplicant.educationLevel}</p>
                        <p><strong>Experience Level:</strong> {selectedApplicant.experienceLevel}</p>
                        <p><strong>University:</strong> {selectedApplicant.university}</p>
                        <p><strong>Motivation Letter:</strong> {selectedApplicant.motivationLetter}</p>
                        <p><strong>Resume:</strong> <a href={`http://localhost:5000/${selectedApplicant.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                        <p><strong>Status:</strong> {selectedApplicant.status}</p>
                        <p><strong>Applied on:</strong> {new Date(selectedApplicant.createdAt).toLocaleDateString()} {new Date(selectedApplicant.createdAt).toLocaleTimeString()}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeApplicationDetails}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default JobApplicants;
