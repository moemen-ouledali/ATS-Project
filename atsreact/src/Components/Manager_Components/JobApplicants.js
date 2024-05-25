import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const JobApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const { jobId } = useParams();

    const fetchApplicants = useCallback(async () => {
        try {
            const [applicantsResponse, jobResponse] = await Promise.all([
                axios.get(`http://localhost:5000/api/applications/for-job/${jobId}`),
                axios.get(`http://localhost:5000/api/jobs/${jobId}`)
            ]);

            setApplicants(applicantsResponse.data);
            setJobDetails(jobResponse.data);
        } catch (error) {
            console.error('Failed to fetch applicants or job details:', error);
        }
    }, [jobId]);

    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]);

    const acceptApplication = async (appId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/accept/${appId}`);
            fetchApplicants();
        } catch (error) {
            console.error('Failed to accept application:', error);
        }
    };

    const declineApplication = async (appId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/decline/${appId}`);
            fetchApplicants();
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

    const calculateMatchPercentage = (requirements, resumeText) => {
        const resumeWords = resumeText.toLowerCase().split(/\s+/);
        const matchedRequirements = requirements.filter(requirement =>
            resumeWords.includes(requirement.toLowerCase())
        );
        return (matchedRequirements.length / requirements.length) * 100;
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
            <h2>Applicants for {jobDetails?.title}</h2>
            {applicants.length === 0 ? (
                <p>No applicants for {jobDetails?.title} at the current time.</p>
            ) : (
                applicants.map(applicant => {
                    const matchPercentage = calculateMatchPercentage(jobDetails.requirements, applicant.resumeText);
                    return (
                        <div key={applicant._id} style={style.applicant}>
                            <p><strong>Name:</strong> {applicant.name}</p>
                            <p><strong>Education Level:</strong> {applicant.educationLevel}</p>
                            <p><strong>Experience Level:</strong> {applicant.experienceLevel}</p>
                            <p><strong>Status:</strong> {applicant.status || 'In Review'}</p>
                            <p><strong>Applied on:</strong> {new Date(applicant.createdAt).toLocaleDateString()} {new Date(applicant.createdAt).toLocaleTimeString()}</p>
                            <p><strong>Match Percentage:</strong> {matchPercentage.toFixed(0)}%</p>
                            <button style={style.acceptButton} onClick={() => acceptApplication(applicant._id)}>Accept</button>
                            <button style={style.declineButton} onClick={() => declineApplication(applicant._id)}>Decline</button>
                            <button style={style.detailsButton} onClick={() => showApplicationDetails(applicant)}>View Details</button>
                        </div>
                    );
                })
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
