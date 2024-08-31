import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, CircularProgress, Paper } from '@mui/material';
import api from '../utils/api';

const ExerciseSuggestions = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/api/suggestions/exercises');
        setExercises(response.data);
      } catch (error) {
        setError('Failed to load exercise suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h5" gutterBottom>Exercise Suggestions</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : exercises.length > 0 ? (
        <List>
          {exercises.map((exercise, index) => (
            <ListItem key={index}>{exercise}</ListItem>
          ))}
        </List>
      ) : (
        <Typography>No suggestions available.</Typography>
      )}
    </Paper>
  );
};

export default ExerciseSuggestions;
