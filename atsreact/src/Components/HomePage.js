// HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [jobListings, setJobListings] = useState([]);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/joblistings');
        setJobListings(response.data);
      } catch (error) {
        console.error('Failed to fetch job listings:', error);
      }
    };

    fetchJobListings();
  }, []);

  // Inline CSS styles
  const styles = {
    container: {
      padding: '20px',
    },
    heading: {
      color: '#0275d8', // Bootstrap info color
    },
    jobListing: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9',
    },
    jobTitle: {
      color: '#5bc0de', // Bootstrap info color
      marginBottom: '5px',
    },
    detail: {
      marginBottom: '4px',
    },
    strong: {
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>WELCOME TO BEECODERS!</h1>
      <div>
        <h2 style={styles.heading}>Job Listings</h2>
        {jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div key={listing._id} style={styles.jobListing}>
              <h3 style={styles.jobTitle}>{listing.title} at {listing.company}</h3>
              <p style={styles.detail}><strong style={styles.strong}>Description:</strong> {listing.description}</p>
              <p style={styles.detail}><strong style={styles.strong}>Location:</strong> {listing.location}</p>
              <p style={styles.detail}><strong style={styles.strong}>Job Type:</strong> {listing.jobType}</p>
              <p style={styles.detail}><strong style={styles.strong}>Requirements:</strong> {listing.requirements}</p>
              <p style={styles.detail}><strong style={styles.strong}>Salary Range:</strong> {listing.salaryRange}</p>
              <p style={styles.detail}><strong style={styles.strong}>Experience Level:</strong> {listing.experienceLevel}</p>
            </div>
          ))
        ) : (
          <p>No job listings found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
