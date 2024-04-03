import React from 'react';
import { Link } from 'react-router-dom'; // Only if you're using React Router

const CallToAction = () => {
  return (
    <section className="py-5 bg-gradient-primary-to-secondary text-white">
      <div className="container px-5 my-5">
        <div className="text-center">
          <h2 className="display-4 fw-bolder mb-4">Are you looking for an Internship ?</h2>
          {/* Use a regular <a> tag for external links or <Link> for internal routing */}
          <a className="btn btn-outline-light btn-lg px-5 py-3 fs-6 fw-bolder" href="contact.html">Discover Our internship Opportunities</a>
          {/* If using React Router for internal navigation, replace the above <a> with this:
          <Link to="/contact" className="btn btn-outline-light btn-lg px-5 py-3 fs-6 fw-bolder">Contact me</Link>
          */}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
