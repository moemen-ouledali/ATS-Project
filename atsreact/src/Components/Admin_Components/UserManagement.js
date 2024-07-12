import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Modal,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#50E3C2',
    },
    background: {
      default: '#f7f9fc',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h4: {
      fontWeight: 800,
      color: '#333',
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 700,
      color: '#555',
      fontSize: '1.5rem',
    },
    body2: {
      color: '#777',
      fontSize: '1rem',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
      fontSize: '0.875rem',
    },
  },
});

const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  borderRadius: '15px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#fff',
  marginBottom: '20px',
});

const StyledButton = styled(Button)({
  backgroundColor: '#4A90E2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#357ABD',
  },
  padding: '10px 20px',
  fontSize: '14px',
  borderRadius: '30px',
  transition: 'background-color 0.3s ease-in-out',
});

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTermManager, setSearchTermManager] = useState('');
  const [searchTermCandidate, setSearchTermCandidate] = useState('');
  const [searchTermAdmin, setSearchTermAdmin] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState('manageUsers');
  const [newManager, setNewManager] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    phoneNumber: '',
    gender: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeRole = async () => {
    try {
      await axios.put(`http://localhost:5000/auth/user/${selectedUser._id}/role`, { role: newRole });
      setUsers(users.map(user => user._id === selectedUser._id ? { ...user, role: newRole } : user));
      setModalOpen(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      console.error('Error changing user role:', error);
      alert('Failed to change user role');
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setNewRole('');
  };

  const handleCreateManager = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        role: 'Manager',
        firstName: newManager.firstName,
        lastName: newManager.lastName,
        email: newManager.email,
        dateOfBirth: newManager.dateOfBirth,
        password: newManager.password,
        phoneNumber: newManager.phoneNumber,
        gender: newManager.gender,
        isVerified: true, // Automatically verify managers
      });
      setUsers([...users, response.data]);
      setNewManager({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        password: '',
        phoneNumber: '',
        gender: '',
      });
      setView('manageUsers');
    } catch (error) {
      console.error('Error creating manager:', error);
      alert('Failed to create manager');
    }
  };

  const filteredUsers = (role, searchTerm) => users.filter(user =>
    user.role === role &&
    (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedUsers = (users) => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return users.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const renderTable = (role, searchTerm, setSearchTerm) => {
    const usersToShow = paginatedUsers(filteredUsers(role, searchTerm));
    return (
      <StyledCard>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ marginBottom: '20px', color: theme.palette.primary.main }}>
            {role}s
          </Typography>
          <TextField
            type="text"
            placeholder={`Search ${role.toLowerCase()}s`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: '20px' }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersToShow.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <StyledButton variant="contained" size="small" onClick={() => openModal(user)}>Change Role</StyledButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              count={Math.ceil(filteredUsers(role, searchTerm).length / usersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CardContent>
      </StyledCard>
    );
  };

  if (loading) {
    return (
      <Container className="text-center" style={{ marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center" style={{ marginTop: '50px' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '40px 24px', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center',
            marginBottom: '40px',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          User Management
        </Typography>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <StyledButton variant="contained" size="large" onClick={() => setView('manageUsers')} sx={{ marginRight: '10px' }}>
              Manage Users
            </StyledButton>
            <StyledButton variant="contained" size="large" onClick={() => setView('createManager')}>
              Create Manager Account
            </StyledButton>
          </Box>
          {view === 'manageUsers' && (
            <>
              {renderTable('Manager', searchTermManager, setSearchTermManager)}
              {renderTable('Candidate', searchTermCandidate, setSearchTermCandidate)}
              {renderTable('Admin', searchTermAdmin, setSearchTermAdmin)}
            </>
          )}
          {view === 'createManager' && (
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ marginBottom: '20px', color: theme.palette.primary.main }}>
                  Create Manager Account
                </Typography>
                <TextField
                  type="text"
                  label="First Name"
                  value={newManager.firstName}
                  onChange={e => setNewManager({ ...newManager, firstName: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  type="text"
                  label="Last Name"
                  value={newManager.lastName}
                  onChange={e => setNewManager({ ...newManager, lastName: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  type="email"
                  label="Email"
                  value={newManager.email}
                  onChange={e => setNewManager({ ...newManager, email: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  type="date"
                  label="Date of Birth"
                  value={newManager.dateOfBirth}
                  onChange={e => setNewManager({ ...newManager, dateOfBirth: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="password"
                  label="Password"
                  value={newManager.password}
                  onChange={e => setNewManager({ ...newManager, password: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  type="text"
                  label="Phone Number"
                  value={newManager.phoneNumber}
                  onChange={e => setNewManager({ ...newManager, phoneNumber: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  select
                  label="Gender"
                  value={newManager.gender}
                  onChange={e => setNewManager({ ...newManager, gender: e.target.value })}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: '20px' }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>
                <StyledButton onClick={handleCreateManager} fullWidth>Create Manager</StyledButton>
              </CardContent>
            </StyledCard>
          )}
        </Container>
        <Modal open={modalOpen} onClose={closeModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography variant="h6" gutterBottom>Change Role</Typography>
            {selectedUser && (
              <>
                <Typography variant="body1" gutterBottom>{selectedUser.firstName} {selectedUser.lastName}</Typography>
                <TextField
                  select
                  label="Select Role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                >
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Candidate">Candidate</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
                <StyledButton onClick={handleChangeRole} fullWidth>Change Role</StyledButton>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default UserManagement;
