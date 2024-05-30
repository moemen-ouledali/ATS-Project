import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Container, Paper, CircularProgress, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { AuthContext } from '../../AuthContext';

const TestPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/category/${category}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });
        setTest(response.data);
        setAnswers(new Array(response.data.questions.length).fill(''));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch test:', error);
        setError('Failed to fetch test');
        setLoading(false);
      }
    };

    fetchTest();
  }, [category, authToken]);

  const handleOptionChange = (index, option) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!authToken) {
      console.error('No token found');
      return;
    }

    const params = new URLSearchParams(location.search);
    const applicationId = params.get('applicationId');

    if (!applicationId) {
      console.error('No applicationId found in URL');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/tests/submit',
        {
          testId: test._id,
          answers,
          applicationId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log('Test submission response:', response.data);
      setScore(response.data.score);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!test || !test.questions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Typography color="error">Test not available</Typography>
      </Box>
    );
  }

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {category} Test
      </Typography>
      {test.questions.map((question, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="h6">{question.question}</Typography>
          <RadioGroup
            value={answers[index]}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          >
            {question.options.map((option, i) => (
              <FormControlLabel
                key={i}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      {score !== null && (
        <Typography variant="h5" sx={{ mt: 4 }}>
          Your score: {score}/{test.questions.length}
        </Typography>
      )}
    </Container>
  );
};

export default TestPage;
