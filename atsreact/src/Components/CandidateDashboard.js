// CandidateDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const CandidateDashboard = () => {
  const { userId } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobapplications/candidate/${userId}`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        // Optionally set an error state here and render it in the UI
      }
    };

    fetchApplications();
  }, [userId]);

  return (
    <div>
      <h2>Your Applications</h2>
      {applications.map(app => (
        <div key={app._id}>
          <p>Job Title: {app.jobId.title}</p>
          <p>Application Status: {app.status}</p>
          {/* Add more details if you wish */}
        </div>
      ))}
    </div>
  );
};

export default CandidateDashboard;
