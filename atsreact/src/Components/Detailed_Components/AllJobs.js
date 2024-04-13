// AllJobs.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Update the URL to match your server's address and port
        const response = await axios.get('http://localhost:5000/api/joblistings');
        // Filter out internships from the job listings
        const nonInternshipJobs = response.data.filter(job => job.jobType !== 'Internship');
        setJobs(nonInternshipJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h1>All Job Opportunities</h1>
      {jobs.map((job) => (
        <div key={job._id}>
          <h2>{job.title}</h2>
          {/* Add additional job details here */}
        </div>
      ))}
    </div>
  );
};

export default AllJobs;
