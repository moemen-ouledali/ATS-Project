// src/Components/Manager_Components/AllApplications.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const fetchAllApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/applications/all');
                setApplications(response.data);
            } catch (error) {
                console.error('Failed to fetch applications:', error);
            }
        };

        fetchAllApplications();
    }, []);

    const acceptApplication = async (appId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/accept/${appId}`);
            const updatedApplications = applications.map(app => 
                app._id === appId ? { ...app, status: 'Accepted' } : app
            );
            setApplications(updatedApplications);
        } catch (error) {
            console.error('Failed to accept application:', error);
        }
    };

    const declineApplication = async (appId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/decline/${appId}`);
            const updatedApplications = applications.map(app => 
                app._id === appId ? { ...app, status: 'Declined' } : app
            );
            setApplications(updatedApplications);
        } catch (error) {
            console.error('Failed to decline application:', error);
        }
    };

    const showApplicationDetails = (application) => {
        setSelectedApplication(application);
    };

    const closeApplicationDetails = () => {
        setSelectedApplication(null);
    };

    const style = {
        container: { padding: '20px' },
        application: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
        button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer', backgroundColor: 'lightblue' },
        acceptButton: { backgroundColor: 'lightgreen' },
        declineButton: { backgroundColor: 'salmon', color: 'white' },
    };

    return (
        <div style={style.container}>
            <h2>All Applications</h2>
            {applications.length === 0 ? (
                <p>No applications available at the current time.</p>
            ) : (
                applications.map(app => (
                    <div key={app._id} style={style.application}>
                        <p><strong>Name:</strong> {app.name}</p>
                        <p><strong>Education Level:</strong> {app.educationLevel}</p>
                        <p><strong>Experience Level:</strong> {app.experienceLevel}</p>
                        <p><strong>Status:</strong> {app.status}</p>
                        <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()} {new Date(app.createdAt).toLocaleTimeString()}</p>
                        <button style={style.acceptButton} onClick={() => acceptApplication(app._id)}>Accept</button>
                        <button style={style.declineButton} onClick={() => declineApplication(app._id)}>Decline</button>
                        <button style={style.button} onClick={() => showApplicationDetails(app)}>View Details</button>
                    </div>
                ))
            )}
            {selectedApplication && (
                <Modal show onHide={closeApplicationDetails}>
                    <Modal.Header closeButton>
                        <Modal.Title>Application Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Name:</strong> {selectedApplication.name}</p>
                        <p><strong>Email:</strong> {selectedApplication.email}</p>
                        <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                        <p><strong>Education Level:</strong> {selectedApplication.educationLevel}</p>
                        <p><strong>Experience Level:</strong> {selectedApplication.experienceLevel}</p>
                        <p><strong>University:</strong> {selectedApplication.university}</p>
                        <p><strong>Motivation Letter:</strong> {selectedApplication.motivationLetter}</p>
                        <p><strong>Resume:</strong> <a href={`http://localhost:5000/${selectedApplication.resumePath}`} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                        <p><strong>Status:</strong> {selectedApplication.status}</p>
                        <p><strong>Applied on:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()} {new Date(selectedApplication.createdAt).toLocaleTimeString()}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeApplicationDetails}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AllApplications;
