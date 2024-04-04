import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming axios for HTTP requests

const InternshipListings = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/joblistings', {
            params: { jobType: 'Internship' }
        });
        setInternships(response.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchInternships();
  }, []);

  return (
    <div>
      <h1>Internship Opportunities</h1>
      {internships.length > 0 ? (
        internships.map((internship) => (
          <div key={internship._id}>
            <h2>{internship.title}</h2>
            <p>{internship.description}</p>
            {/* Display more internship details here */}
          </div>
        ))
      ) : (
        <p>No internships available at the moment.</p>
      )}
    </div>
  );
};

export default InternshipListings;
