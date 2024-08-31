import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/api/auth/login', values);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      setSnackMessage('Login successful');
      setOpenSnack(true);
      setSnackSeverity('success');
      setTimeout(() => navigate('/dashboard'), 5000);
    } catch (error) {
      setSnackMessage('Invalid credentials');
      setOpenSnack(true);
      setSnackSeverity('error');
      setTimeout(() => navigate('/login'), 5000);
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
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
              Login
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

export default Login;
