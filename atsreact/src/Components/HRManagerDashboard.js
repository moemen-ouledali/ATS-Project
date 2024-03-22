import React from 'react';
import AddJobListing from './AddJobListing'; // Adjust the path as necessary

const HRManagerDashboard = () => {
  return (
    <div>
      <h2>Welcome HR MANAGER</h2>
      <AddJobListing /> {/* This line adds the job listing form to the HR Manager's Dashboard */}
    </div>
  );
};

export default HRManagerDashboard;
