import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container, Typography, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';

const Activation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const [isError, setIsError] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await api(`/api/auth/activate/${token}`);
        const result = await response.data;

        if (response.status === 200) { // Use status code for success check
          setMessage(result.message || 'Activated');
          setOpenSnack(true); // Show success message
          setTimeout(() => navigate('/login'), 5000); // Redirect to login after 2 seconds
        } else {
          setIsError(true);
          setMessage(result.message || 'Activation failed');
          setOpenSnack(true); // Show error message
          setTimeout(() => navigate('/login'), 5000); // Redirect to login after 2 seconds
        }
      } catch (error) {
        setIsError(true);
        setMessage('An error occurred');
        setOpenSnack(true); // Show error message
        setTimeout(() => navigate('/login'), 5000); // Redirect to login after 2 seconds
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: 20, textAlign: 'center' }}>
        {message === 'Verifying...' ? (
          <CircularProgress />
        ) : (
          <Typography variant="h5" color={isError ? 'error' : 'success'}>
            {message}
          </Typography>
        )}
      </Paper>
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
        action={<button onClick={() => setOpenSnack(false)}>Close</button>}
      >
        <Alert onClose={() => setOpenSnack(false)} severity={isError ? 'error' : 'success'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Activation;
