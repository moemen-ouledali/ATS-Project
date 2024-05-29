import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { authToken, userDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/applications', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          email: userDetails.email,
        },
      });

      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
      console.error(err);
    }
  }, [authToken, userDetails.email]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const showApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicationDetails = () => {
    setSelectedApplication(null);
  };

  const handleEvaluationTest = (category, applicationId) => {
    navigate(`/test/${category}?applicationId=${applicationId}`);
  };

  const style = {
    container: { padding: '20px' },
    applicant: { border: '1px solid #ccc', borderRadius: '8px', padding: '10px', marginBottom: '10px' },
    button: { marginRight: '10px', padding: '8px 12px', cursor: 'pointer' },
    detailsButton: { backgroundColor: 'lightblue' },
    evaluationButton: { backgroundColor: 'lightgreen' },
  };

  return (
    <div style={style.container}>
      <h2>Your Applications</h2>
      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map(app => (
            <div key={app._id} style={style.applicant}>
              <p><strong>Job:</strong> {app.jobId.title}</p>
              <p><strong>Date Applied:</strong> {new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString()}</p>
              <p><strong>Education Level:</strong> {app.educationLevel}</p>
              <p><strong>Experience Level:</strong> {app.experienceLevel}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <Button style={style.detailsButton} onClick={() => showApplicationDetails(app)}>View Details</Button>
              {app.status === 'Accepted' && (
                <Button
                  style={style.evaluationButton}
                  onClick={() => handleEvaluationTest(app.jobId.category, app._id)}
                >
                  Evaluation Test
                </Button>
              )}
            </div>
          ))
        )
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeApplicationDetails}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CandidateDashboard;
