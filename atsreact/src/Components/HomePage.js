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
        // Handle error appropriately in your UI
      }
    };

    fetchJobListings();
  }, []); // Effect runs on component mount

  return (
    <div>
      <h1>WELCOME TO BEECODERS!</h1>
      <div>
        <h2>Job Listings</h2>
        {jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div key={listing._id}>
              <h3>{listing.title} at {listing.company}</h3>
              <p>{listing.description}</p>
              {/* Add more details as needed */}
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
