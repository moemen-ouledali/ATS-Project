import React, { useState, useEffect } from 'react'; // Importing necessary React hooks
import { useParams, Link as RouterLink } from 'react-router-dom'; // Importing necessary components from React Router
import axios from 'axios'; // Importing axios for making HTTP requests
import { 
  Grid, Card, CardActionArea, CardMedia, CardContent, 
  Typography, CardActions, Button, Box, CircularProgress 
} from '@mui/material'; // Importing Material-UI components
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importing theme creation functions from Material-UI
import { styled } from '@mui/system'; // Importing styled function for custom styling





// Importing images
import image1 from '../../Media/cards media/1.png';
import image2 from '../../Media/cards media/2.png';
import image3 from '../../Media/cards media/3.png';
import image4 from '../../Media/cards media/4.png';
import image5 from '../../Media/cards media/5.png';
import image6 from '../../Media/cards media/6.png';
import image7 from '../../Media/cards media/7.png';
import image8 from '../../Media/cards media/8.png';





// Storing imported images in an array
const cardImages = [image1, image2, image3, image4, image5, image6, image7, image8];





// Creating a custom theme using Material-UI's createTheme function
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Main color for primary elements
    },
    secondary: {
      main: '#50E3C2', // Main color for secondary elements
    },
    background: {
      default: '#f7f9fc', // Default background color
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Setting default font family
    h4: {
      fontWeight: 800, // Bold font weight for h4 headers
      color: '#333', // Color for h4 headers
      fontSize: '2rem', // Font size for h4 headers
    },
    h5: {
      fontWeight: 700, // Bold font weight for h5 headers
      color: '#555', // Color for h5 headers
      fontSize: '1.5rem', // Font size for h5 headers
    },
    body2: {
      color: '#777', // Color for body2 text
      fontSize: '1rem', // Font size for body2 text
    },
    button: {
      textTransform: 'uppercase', // Transform button text to uppercase
      fontWeight: 700, // Bold font weight for buttons
      fontSize: '0.875rem', // Font size for buttons
    },
  },
});












// Creating a styled component for Card using styled function from @mui/system
const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Adding transition effects
  '&:hover': {
    transform: 'scale(1.05)', // Scale up the card on hover
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', // Adding box shadow on hover
  },
  borderRadius: '15px', // Rounding the corners of the card
  overflow: 'hidden', // Ensuring content doesn't overflow
  position: 'relative', // Setting position to relative
  backgroundColor: '#fff', // Setting background color to white
});










// Creating a styled component for Button using styled function from @mui/system
const StyledButton = styled(Button)({
  backgroundColor: '#4A90E2', // Setting background color for the button
  color: '#fff', // Setting text color to white
  '&:hover': {
    backgroundColor: '#357ABD', // Changing background color on hover
  },
  padding: '10px 20px', // Adding padding to the button
  fontSize: '14px', // Setting font size for the button
  borderRadius: '30px', // Rounding the corners of the button
});










// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Getting random index
    [array[i], array[j]] = [array[j], array[i]]; // Swapping elements
  }
  return array; // Returning the shuffled array
}






// Main functional component for displaying job listings
const JobListingsPage = () => {
  const { category } = useParams(); // Category from URL parameters
  const [jobListings, setJobListings] = useState([]); // State to store job listings
  const [loading, setLoading] = useState(true); // State to manage loading status





  // Shuffle images array to display random images for each card
  const shuffledImages = shuffleArray([...cardImages]);






  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        // Fetching job listings from the API
        const response = await axios.get(`http://localhost:5000/api/jobs?category=${encodeURIComponent(category)}`);
        const nonInternshipJobs = response.data.filter(listing => listing.jobType.toLowerCase() !== 'internship'); // Filtering out internship jobs
        setJobListings(nonInternshipJobs); // Setting job listings data
        setLoading(false); // Setting loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching job listings:', error); // Logging any errors
        setLoading(false); // Setting loading to false even if there's an error
      }
    };

    fetchJobListings(); // Calling the function to fetch job listings
  }, [category]); // Dependency array containing the category








  
  return (
    // Wrapping the component with ThemeProvider to apply the custom theme
    <ThemeProvider theme={theme}>
      {/* Main container with padding and background color */}
      <Box sx={{ padding: '40px 24px', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        {/* Heading for the job listings */}
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center', // Center aligning the text
            marginBottom: '40px', // Adding bottom margin
            fontWeight: 'bold', // Making the text bold
            color: theme.palette.primary.main, // Setting text color
          }}
        >
          <span className="text-gradient d-inline">Job Listings for "{decodeURIComponent(category)}"</span>
        </Typography>
        {/* Conditional rendering based on loading state */}
        {loading ? (
          // Displaying a loading spinner while data is being fetched
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          // Displaying the list of job listings in a grid
          <Grid container spacing={4}>
            {/* Checking if there are any job listings to display */}
            {jobListings.length > 0 ? (
              // Mapping over job listings array to create a card for each listing
              jobListings.map((listing, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id}>
                  <StyledCard raised>
                    {/* Making the card clickable and linking to the job details page */}
                    <CardActionArea component={RouterLink} to={`/job/${listing._id}`}>
                      {/* Displaying the image for the job listing */}
                      <CardMedia
                        component="img"
                        alt={listing.title}
                        height="500"
                        width="500"
                        image={shuffledImages[index % shuffledImages.length]}
                      />
                      {/* Displaying the job title and description */}
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {listing.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {listing.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    {/* Adding a button to apply for the job */}
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <StyledButton size="small" component={RouterLink} to={`/job/${listing._id}`}>
                        Apply Now
                      </StyledButton>
                    </CardActions>
                  </StyledCard>
                </Grid>
              ))
            ) : (
              // Displaying a message if no job listings are found
              <Typography variant="subtitle1" sx={{ textAlign: 'center', width: '100%' }}>
                No job listings found in this category.
              </Typography>
            )}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default JobListingsPage; // Exporting the component to be used in other parts of the app
