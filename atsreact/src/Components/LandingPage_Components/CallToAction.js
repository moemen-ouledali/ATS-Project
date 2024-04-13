import React from 'react';
import { Link } from 'react-router-dom'; // Ensure React Router is being used

const CallToAction = () => {
  return (
    <section className="py-5 bg-gradient-primary-to-secondary text-white">
      <div className="container px-5 my-5">
        <div className="text-center">
          <h2 className="display-4 fw-bolder mb-4">Are you looking for an INTERNSHIP ?</h2>
          <Link to="/internships" className="btn btn-outline-light btn-lg px-5 py-3 fs-6 fw-bolder">Discover Our Internship Opportunities</Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
