import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@mui/material';
import { getWorkouts } from '../../services/workoutService';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await getWorkouts();
        setWorkouts(response.data);
      } catch (error) {
        setError("Error fetching workouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h6" gutterBottom>
        Your Workouts
      </Typography>
      {workouts.length > 0 ? (
        workouts.map((workout) => (
          <div key={workout._id} style={{ marginBottom: 16 }}>
            <Typography variant="subtitle1">{new Date(workout.date).toLocaleDateString()}</Typography>
            {workout.exercises.map((exercise, index) => (
              <div key={index}>
                <Typography>
                  <strong>{exercise.name}</strong>: {exercise.duration} minutes, {exercise.intensity} intensity, {exercise.caloriesBurned} calories burned
                </Typography>
                <Divider />
              </div>
            ))}
          </div>
        ))
      ) : (
        <Typography>No workouts logged yet.</Typography>
      )}
    </Paper>
  );
};

export default WorkoutList;
