import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Too short').required('Please enter your name'),
    email: Yup.string().email('Invalid email address').required('Please enter your email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Please enter your password'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/api/auth/register', values);
      localStorage.setItem('token', response.data.token);
      setSnackMessage('Registration successful');
      setOpenSnack(true);
      setSnackSeverity('success');
      setTimeout(() => navigate('/dashboard'), 5000);
    } catch (error) {
      setSnackMessage('Registration failed');
      setOpenSnack(true);
      setSnackSeverity('error');
      setTimeout(() => navigate('/register'), 5000);
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={{ width: '100%' }}>
            <div style={{ marginBottom: 16 }}>
              <Field
                as={TextField}
                name="name"
                label="Name"
                fullWidth
                variant="outlined"
              />
              <ErrorMessage name="name" component="p" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field
                as={TextField}
                type="email"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
              />
              <ErrorMessage name="email" component="p" style={{ color: 'red' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field
                as={TextField}
                type="password"
                name="password"
                label="Password"
                fullWidth
                variant="outlined"
              />
              <ErrorMessage name="password" component="p" style={{ color: 'red' }} />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={() => setOpenSnack(false)}
        action={<Button color="inherit" onClick={() => setOpenSnack(false)}>Close</Button>}
      >
        <Alert onClose={() => setOpenSnack(false)} severity={snackSeverity}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
