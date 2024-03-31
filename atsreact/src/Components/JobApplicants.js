import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const { jobId } = useParams();

  const fetchApplicants = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobapplications/for-job/${jobId}`);
      setApplicants(response.data);
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    }
  }, [jobId]); // Dependency array for useCallback

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]); // Now fetchApplicants is stable and won't cause unnecessary rerenders

  const acceptApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobapplications/accept/${appId}`);
      fetchApplicants(); // Refresh the list of applicants to show updated status
    } catch (error) {
      console.error('Failed to accept application:', error);
    }
  };

  const declineApplication = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/jobapplications/decline/${appId}`);
      fetchApplicants(); // Refresh the list of applicants to show updated status
    } catch (error) {
      console.error('Failed to decline application:', error);
    }
  };

  return (
    <div>
      <h2>Applicants</h2>
      {applicants.map(applicant => (
        <div key={applicant._id}>
          <p>Name: {applicant.name}</p>
          <p>Email: {applicant.applicantId ? applicant.applicantId.email : 'N/A'}</p>
          <p>Status: {applicant.status || 'In Review'}</p>
          <button onClick={() => acceptApplication(applicant._id)}>Accept</button>
          <button onClick={() => declineApplication(applicant._id)}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default JobApplicants;
