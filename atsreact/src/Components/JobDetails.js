// JobDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To access the job ID from the URL

const JobDetails = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(""); // Add an error state

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Inside JobDetails.js
        const response = await axios.get(`http://localhost:5000/api/joblistings/${jobId}`);

        setJobDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        setError('Failed to load job details. Please try again later.'); // Set an error message
      }
    };

    fetchJobDetails();
        }, [jobId]);

        if (error) {
        return <div>Error: {error}</div>; // Display error message if there's an error
        }

        if (!jobDetails) {
        return <div>Loading...</div>; // Display loading text while job details are being fetched
        }

  return (
    <div>
      <h2>{jobDetails.title} at {jobDetails.company}</h2>
      <p>Job Type: {jobDetails.jobType}</p>
      <p>Description: {jobDetails.description}</p>
      <p>Location: {jobDetails.location}</p>
      <p>Requirements: {jobDetails.requirements}</p>
      <p>Salary Range: {jobDetails.salaryRange}</p>
      <p>Experience Level: {jobDetails.experienceLevel}</p>
    </div>
  );
};

export default JobDetails;
