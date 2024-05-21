import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LoginForm.css';

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    role: 'Candidate',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    phoneNumber: '',
    city: '',
    highestEducationLevel: 'Baccalaureate',
    gender: '' // Add this line
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/register', userData);
      navigate('/login'); // Navigate to login or another appropriate page after registration
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            {/* Replace with your actual image for the registration page */}
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              {/* Dynamic form inputs */}
              <input type="text" name="firstName" className="form-control form-control-lg" placeholder="First Name" value={userData.firstName} onChange={handleChange} required />
              <input type="text" name="lastName" className="form-control form-control-lg" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required />
              <input type="email" name="email" className="form-control form-control-lg" placeholder="Email Address" value={userData.email} onChange={handleChange} required />
              <input type="date" name="dateOfBirth" className="form-control form-control-lg" placeholder="Date of Birth" value={userData.dateOfBirth} onChange={handleChange} required />
              <input type="password" name="password" className="form-control form-control-lg" placeholder="Password" value={userData.password} onChange={handleChange} required />
              <input type="text" name="phoneNumber" className="form-control form-control-lg" placeholder="Phone Number" value={userData.phoneNumber} onChange={handleChange} required />
              
              <select name="city" className="form-select form-select-lg" value={userData.city} onChange={handleChange} required>
                <option value="">Select a governorate</option>
                <option value="Ariana">Ariana</option>
                <option value="Béja">Béja</option>
                <option value="Ben Arous">Ben Arous</option>
                <option value="Bizerte">Bizerte</option>
                <option value="Gabès">Gabès</option>
                <option value="Gafsa">Gafsa</option>
                <option value="Jendouba">Jendouba</option>
                <option value="Kairouan">Kairouan</option>
                <option value="Kasserine">Kasserine</option>
                <option value="Kébili">Kébili</option>
                <option value="Kef">Kef</option>
                <option value="Mahdia">Mahdia</option>
                <option value="Manouba">Manouba</option>
                <option value="Médenine">Médenine</option>
                <option value="Monastir">Monastir</option>
                <option value="Nabeul">Nabeul</option>
                <option value="Sfax">Sfax</option>
                <option value="Sidi Bouzid">Sidi Bouzid</option>
                <option value="Siliana">Siliana</option>
                <option value="Sousse">Sousse</option>
                <option value="Tataouine">Tataouine</option>
                <option value="Tozeur">Tozeur</option>
                <option value="Tunis">Tunis</option>
                <option value="Zaghouan">Zaghouan</option>
              </select>

              <select name="highestEducationLevel" className="form-select form-select-lg" value={userData.highestEducationLevel} onChange={handleChange} required>
                <option value="Baccalaureate">Baccalaureate</option>
                <option value="Licence">Licence</option>
                <option value="Engineering">Engineering</option>
              </select>

              <select name="gender" className="form-select form-select-lg" value={userData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select name="role" className="form-select form-select-lg" value={userData.role} onChange={handleChange} required>
                <option value="Candidate">Candidate</option>
                <option value="Manager">Manager</option>
              </select>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Register</button>
                <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="#!" className="link-danger">Login</a></p>
              </div>
              {message && <div className="alert alert-danger mt-3" role="alert">
                {message}
              </div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
