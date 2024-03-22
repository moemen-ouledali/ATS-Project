import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton'; // Adjust the import path as necessary

const CandidateNav = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/candidate_dashboard">Dashboard CANDIDATE </Link></li>
        <li><Link to="/edit-profile">Edit Profile CANDIDATE </Link></li>
        <li><LogoutButton /></li>
      </ul>
    </nav>
  );
};

export default CandidateNav;
