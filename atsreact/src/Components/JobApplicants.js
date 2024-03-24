// JobApplicants.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const { jobId } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobapplications/for-job/${jobId}`);
        setApplicants(response.data);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
        // Optionally set an error state here and render it in the UI.
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div>
      <h2>Applicants</h2>
      {applicants.map(applicant => (
        <div key={applicant._id}>
          <p>Name: {applicant.name}</p>
          <p>Email: {applicant.applicantId.email}</p>
          {/* Add other applicant details you want to display */}
        </div>
      ))}
    </div>
  );
};

export default JobApplicants;
