// JobDetails.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Update the import path as necessary

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { authToken, userId } = useContext(AuthContext);
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [application, setApplication] = useState({
    name: '',
    age: '',
    degree: 'License',
    motivationLetter: '',
    resume: null,
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/joblistings/${jobId}`);
        setJobDetails(response.data);
      } catch (err) {
        console.error('Failed to fetch job details:', err);
        setError('Failed to load job details. Please try again later.');
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  const handleApplicationChange = (e) => {
    const { name, value, files } = e.target;
    setApplication({ ...application, [name]: files ? files[0] : value });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!authToken) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('name', application.name);
    formData.append('age', application.age);
    formData.append('degree', application.degree);
    formData.append('motivationLetter', application.motivationLetter);
    formData.append('resume', application.resume);
    formData.append('jobId', jobId);
    formData.append('applicantId', userId);

    try {
      await axios.post(`http://localhost:5000/api/jobapplications/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      alert('Application submitted successfully!');
      setShowApplicationForm(false);
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Failed to submit application.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!jobDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{jobDetails.title} at {jobDetails.company}</h2>
      <p>Job Type: {jobDetails.jobType}</p>
      <p>Description: {jobDetails.description}</p>
      <p>Location: {jobDetails.location}</p>
      <p>Requirements: {jobDetails.requirements}</p>
      <p>Salary Range: {jobDetails.salaryRange}</p>
      <p>Experience Level: {jobDetails.experienceLevel}</p>
      {authToken ? (
        <button onClick={() => setShowApplicationForm(!showApplicationForm)}>
          {showApplicationForm ? 'Cancel Application' : 'Apply'}
        </button>
      ) : (
        <button onClick={() => navigate('/login')}>Login to Apply</button>
      )}
      {showApplicationForm && (
        <form onSubmit={handleSubmitApplication}>
          <input type="text" name="name" placeholder="Name" value={application.name} onChange={handleApplicationChange} required />
          <input type="number" name="age" placeholder="Age" value={application.age} onChange={handleApplicationChange} required />
          <select name="degree" value={application.degree} onChange={handleApplicationChange} required>
            <option value="License">License</option>
            <option value="Engineering">Engineering</option>
            <option value="Baccalaureate">Baccalaureate</option>
          </select>
          <textarea name="motivationLetter" placeholder="Motivation Letter (Optional)" value={application.motivationLetter} onChange={handleApplicationChange} />
          <input type="file" name="resume" accept=".pdf" onChange={handleApplicationChange} required />
          <button type="submit">Submit Application</button>
        </form>
      )}
    </div>
  );
};

export default JobDetails;
