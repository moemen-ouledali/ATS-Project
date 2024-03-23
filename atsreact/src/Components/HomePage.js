// HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

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

  // Inline CSS styles (Keep your existing styles)
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
    discoverButton: {
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#0275d8',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none', // Remove underline from link
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>WELCOME TO BEECODERS!</h1>
      <div>
        <h2 style={styles.heading}>Job Listings</h2>
        {jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div key={listing._id} style={styles.jobListing}>
              <h3 style={styles.jobTitle}>{listing.title}</h3>
              <p style={styles.detail}><strong style={styles.strong}>Job Type:</strong> {listing.jobType}</p>
              <p style={styles.detail}>{listing.description}</p>
              {/* Link to detailed job view using React Router's Link component */}
              <Link to={`/job/${listing._id}`} style={styles.discoverButton}>Discover</Link>
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
