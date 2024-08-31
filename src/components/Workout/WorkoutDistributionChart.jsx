import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Paper, Typography, CircularProgress, Box, Divider } from '@mui/material';
import { getWorkouts } from '../../services/workoutService';

// Register necessary components for Pie chart
Chart.register(ArcElement, Tooltip, Legend);

const WorkoutDistributionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutDistribution = async () => {
      try {
        const response = await getWorkouts();
        const workouts = response.data;

        // Calculate exercise types and their counts
        const exerciseTypes = workouts.reduce((acc, workout) => {
          workout.exercises.forEach(exercise => {
            if (!acc[exercise.name]) {
              acc[exercise.name] = 0;
            }
            acc[exercise.name] += 1;
          });
          return acc;
        }, {});
        console.log(exerciseTypes);

        const labels = Object.keys(exerciseTypes);
        const data = Object.values(exerciseTypes);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Exercise Distribution',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ].slice(0, labels.length),
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ].slice(0, labels.length),
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        setError("Error fetching workout distribution. Please try again later.");
        console.error("Error fetching workout distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDistribution();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 24, margin: 16, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Workout Distribution
      </Typography>
      <Divider style={{ margin: '16px 0' }} />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress size={50} />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <Pie data={chartData} />
        </Box>
      )}
    </Paper>
  );
};

export default WorkoutDistributionChart;
