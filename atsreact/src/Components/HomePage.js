// HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HomePage.css'; // Import your HomePage CSS for custom styles if needed

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

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">WELCOME TO BEECODERS!</h1>
      <div>
        <h2 className="mb-3">Job Listings</h2>
        {jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div key={listing._id} className="card mb-3">
              <div className="card-body">
                <h3 className="card-title">{listing.title}</h3>
                <p className="card-text"><strong>Job Type:</strong> {listing.jobType}</p>
                <p className="card-text">{listing.description}</p>
                {/* Use Link to navigate to the detailed job view */}
                <Link to={`/job/${listing._id}`} className="btn btn-primary">Discover</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No job listings found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
