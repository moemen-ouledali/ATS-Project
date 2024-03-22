// HomePage.js
import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary

const HomePage = () => {
  const { authToken } = useContext(AuthContext); // Use authToken to determine login status

  return (
    <div>
      <h1>WELCOME TO BEECODERS!</h1>
      {authToken ? (
        <p>You are logged in.</p>
      ) : (
        <p>Please login or register.</p>
      )}
    </div>
  );
};

export default HomePage;
