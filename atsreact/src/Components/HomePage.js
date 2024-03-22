// HomePage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary

const HomePage = () => {
  const { authToken } = useContext(AuthContext); // Use authToken to determine login status
  const [jobListings, setJobListings] = useState([]);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/joblistings', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setJobListings(response.data);
      } catch (error) {
        console.error('Failed to fetch job listings:', error);
        // Handle error appropriately in your UI
      }
    };

    if (authToken) {
      fetchJobListings();
    }
  }, [authToken]);

  return (
    <div>
      <h1>WELCOME TO BEECODERS!</h1>
      {authToken ? (
        <>
          <p>You are logged in.</p>
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
        </>
      ) : (
        <p>Please login or register.</p>
      )}
    </div>
  );
};

export default HomePage;
