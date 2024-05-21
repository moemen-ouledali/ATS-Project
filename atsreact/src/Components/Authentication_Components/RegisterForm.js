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
    gender: ''
  });
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
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
      const response = await axios.post('http://localhost:5000/auth/register', userData);
      setMessage(response.data.message);
      setIsVerifying(true);
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/verify-code', { email: userData.email, code: verificationCode });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      setMessage("Verification failed. Please try again.");
      console.error("Verification error:", error);
    }
  };

  return (
    <section className="vh-100 flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Sample" className="img-fluid mb-3" />
                  <h2 className="text-2xl font-bold">Register</h2>
                  <p className="text-gray-600">Sign up to create an account</p>
                </div>
                {!isVerifying ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                      <input type="text" name="firstName" className="form-control form-control-lg" placeholder="First Name" value={userData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                      <input type="text" name="lastName" className="form-control form-control-lg" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                      <input type="email" name="email" className="form-control form-control-lg" placeholder="Email Address" value={userData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                      <input type="date" name="dateOfBirth" className="form-control form-control-lg" placeholder="Date of Birth" value={userData.dateOfBirth} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                      <input type="password" name="password" className="form-control form-control-lg" placeholder="Password" value={userData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
                      <input type="text" name="phoneNumber" className="form-control form-control-lg" placeholder="Phone Number" value={userData.phoneNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-3">
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
                    </div>
                    <div className="form-group mb-3">
                      <select name="highestEducationLevel" className="form-select form-select-lg" value={userData.highestEducationLevel} onChange={handleChange} required>
                        <option value="Baccalaureate">Baccalaureate</option>
                        <option value="Licence">Licence</option>
                        <option value="Engineering">Engineering</option>
                      </select>
                    </div>
                    <div className="form-group mb-3">
                      <select name="gender" className="form-select form-select-lg" value={userData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="form-group mb-3">
                      <select name="role" className="form-select form-select-lg" value={userData.role} onChange={handleChange} required>
                        <option value="Candidate">Candidate</option>
                        <option value="Manager">Manager</option>
                      </select>
                    </div>
                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="submit" className="btn btn-primary btn-lg w-full" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Register</button>
                      <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <a href="/login" className="text-primary">Login</a></p>
                    </div>
                    {message && <div className="alert alert-danger mt-3" role="alert">{message}</div>}
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode}>
                    <div className="form-group mb-3">
                      <input type="text" name="verificationCode" className="form-control form-control-lg" placeholder="Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                    </div>
                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="submit" className="btn btn-primary btn-lg w-full" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Verify</button>
                    </div>
                    {message && <div className="alert alert-danger mt-3" role="alert">{message}</div>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
