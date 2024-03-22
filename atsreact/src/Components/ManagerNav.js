import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton'; // Adjust the import path as necessary

const ManagerNav = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/hr_manager_dashboard">Dashboard MANAGER </Link></li>
        <li><Link to="/edit-profile">Edit Profile MANAGER</Link></li>
        <li><LogoutButton /></li>
      </ul>
    </nav>
  );
};

export default ManagerNav;
