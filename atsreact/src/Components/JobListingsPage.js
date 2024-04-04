import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const JobListingsPage = () => {
  const { category } = useParams(); // Access the category from URL
  const [jobListings, setJobListings] = useState([]);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        // Adjust the endpoint as necessary to match your backend API
        const response = await axios.get(`http://localhost:5000/api/joblistings?category=${encodeURIComponent(category)}`);
        // Filter out internships from the job listings
        const filteredListings = response.data.filter(listing => listing.jobType !== 'Internship');
        setJobListings(filteredListings);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    fetchJobListings();
  }, [category]);

  return (
    <div>
      <h2>Job Listings in {decodeURIComponent(category)}</h2>
      {jobListings.length > 0 ? (
        jobListings.map((listing) => (
          <div key={listing._id} style={{ margin: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p><strong>Company:</strong> {listing.company}</p>
            <p><strong>Location:</strong> {listing.location}</p>
            {/* You might have a detailed view for each job listing */}
            <Link to={`/job/${listing._id}`}>View Details</Link>
          </div>
        ))
      ) : (
        <p>No job listings found in this category.</p>
      )}
    </div>
  );
};

export default JobListingsPage;
