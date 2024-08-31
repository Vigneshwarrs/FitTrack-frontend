import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Snackbar } from '@mui/material';
import WorkoutForm from '../components/Workout/WorkoutForm';
import WorkoutList from '../components/Workout/WorkoutList';
import NutritionList from '../components/Nutrition/NutritionList';
import NutritionForm from '../components/Nutrition/NutritionForm';
import DietSuggestions from '../components/DietSuggestions';
import ExerciseSuggestions from '../components/ExerciseSuggestions';
import WorkoutChart from '../components/Workout//WorkoutChart';
import NutritionChart from '../components/Nutrition/NutritionChart';
import WorkoutDistributionChart from '../components/Workout//WorkoutDistributionChart';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const navigate = useNavigate();

  const handleWorkoutSubmitSuccess = () => {
    setOpenSnack(true);
    setTimeout(() => window.location.reload(), 1000); // Delay to show snackbar
  };

  const handleNutritionSubmitSuccess = () => {
    setOpenSnack(true);
    setTimeout(() => window.location.reload(), 1000); // Delay to show snackbar
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token) {
        navigate('/login');
        console.log('No token found');
        return;
      }
      // try {
      //   const response = await api.get('/api/auth/profile');
      //   setUser(response.data.user);
      // } catch (error) {
      //   console.error('Error fetching user:', error);
      //   localStorage.removeItem('token');
      //   navigate('/login');
      // }
      setUser(JSON.parse(user)  );
    };
    fetchUser();
  }, [navigate]);

  return (
    <Container>
      {user ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.name}
            {
              console.log(typeof user)
            }
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: {user.email}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 16 }}>
                <WorkoutForm onSubmitSuccess={handleWorkoutSubmitSuccess} />
                <WorkoutList />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 16 }}>
                <NutritionForm onSubmitSuccess={handleNutritionSubmitSuccess} />
                <NutritionList />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 16 }}>
                <ExerciseSuggestions />
                <DietSuggestions />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 16 }}>
                <WorkoutChart chartType="today" />
                <NutritionChart chartType="today" />
                <WorkoutDistributionChart />
              </Paper>
            </Grid>
          </Grid>
          <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={() => setOpenSnack(false)}
            message="Data logged successfully"
          />
        </div>
      ) : (
        <Typography variant="h6">Loading...</Typography>
      )}
    </Container>
  );
};

export default Dashboard;
