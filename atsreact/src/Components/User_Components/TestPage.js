import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Container, Paper, CircularProgress, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { AuthContext } from '../../AuthContext';
import { styled } from '@mui/system';

const Timer = styled(Box)({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#ff6347',
  position: 'fixed',
  top: '20px',
  right: '50%',
  transform: 'translateX(50%)',
  zIndex: '1000',
  backgroundColor: '#ffffff',
  padding: '10px 25px',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  border: '3px solid #ff6347',
  animation: 'pulse 2s infinite',
});

const QuestionBox = styled(Box)({
  marginBottom: '40px',
  padding: '30px',
  borderRadius: '20px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: '#f7f7f7',
  },
});

const OptionLabel = styled(FormControlLabel)({
  background: '#fafafa',
  borderRadius: '12px',
  margin: '12px 0',
  padding: '18px',
  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease, transform 0.3s',
  '&:hover': {
    backgroundColor: '#e7e7e7',
    transform: 'scale(1.05)',
  },
});

const SubmitButton = styled(Button)({
  marginTop: '50px',
  padding: '18px 35px',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  backgroundColor: '#007BFF',
  color: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
  transition: 'background-color 0.3s ease, transform 0.3s',
  '&:hover': {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
});

const TestPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`https://ats-project-1.onrender.com/api/tests/category/${category}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });
        setTest(response.data);
        setAnswers(response.data.questions.map(question => ({
          question: question.question,
          givenAnswer: '',
          correctAnswer: question.correctOption,
          isCorrect: false,
        })));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch test:', error);
        setError('Failed to fetch test');
        setLoading(false);
      }
    };

    const checkTestAttempt = async () => {
      const params = new URLSearchParams(location.search);
      const applicationId = params.get('applicationId');
      if (!applicationId) {
        console.error('No applicationId found in URL');
        return;
      }
      try {
        const response = await axios.get(`https://ats-project-1.onrender.com/api/tests/check-attempt/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });
        if (response.data.attempted) {
          setError('You have already attempted this test.');
          setLoading(false);
        } else {
          fetchTest();
        }
      } catch (error) {
        console.error('Failed to check test attempt:', error);
        setError('Failed to check test attempt');
        setLoading(false);
      }
    };

    checkTestAttempt();
  }, [category, authToken, location.search]);

  const handleSubmit = useCallback(async () => {
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
  
    if (!test || !test._id || !answers.length) {
      console.error('Missing test data or answers');
      return;
    }
  
    const payload = {
      testId: test._id,
      answers: answers.map(answer => answer.givenAnswer), // Update here to include only givenAnswer
      applicationId,
    };
  
    console.log('Submitting test with payload:', payload);
  
    try {
      const response = await axios.post(
        'https://ats-project-1.onrender.com/api/tests/submit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log('Test submission response:', response.data);
      setScore(response.data.score);
      navigate(`/test-results/${response.data._id}`); // Navigate to a results page (optional)
    } catch (error) {
      console.error('Failed to submit test:', error.response?.data || error.message);
    }
  }, [authToken, location.search, test, answers, navigate]);
  
  


  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleOptionChange = (index, option) => {
    const newAnswers = [...answers];
    newAnswers[index].givenAnswer = option;
    newAnswers[index].isCorrect = option === test.questions[index].correctOption;
    setAnswers(newAnswers);
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
    <Container component={Paper} sx={{ p: 5, mt: 5, backgroundColor: '#f0f4f8', borderRadius: '20px' }}>
      <Typography variant="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 5 }}>
        {category} Test
      </Typography>
      <Timer>{formatTime(timeLeft)}</Timer>
      {test.questions.map((question, index) => (
        <QuestionBox key={index}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>{question.question}</Typography>
          <RadioGroup
            value={answers[index].givenAnswer}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          >
            {question.options.map((option, i) => (
              <OptionLabel
                key={i}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </QuestionBox>
      ))}
      <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </SubmitButton>
      {score !== null && (
        <Typography variant="h4" sx={{ mt: 5, textAlign: 'center', color: '#007BFF' }}>
          Your score: {score}/{test.questions.length}
        </Typography>
      )}
    </Container>
  );
};

export default TestPage;
