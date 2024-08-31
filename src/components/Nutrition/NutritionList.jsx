import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { getNutritionLogs } from '../../services/nutritionService';

const NutritionList = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionLogs = async () => {
      try {
        const response = await getNutritionLogs();
        setNutritionLogs(response.data);
      } catch (error) {
        setError('Failed to fetch nutrition logs.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionLogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h6" gutterBottom>Your Nutrition Logs</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {nutritionLogs.length > 0 ? (
        nutritionLogs.map((log) => (
          <Box key={log._id} mb={3} p={2} border={1} borderRadius={1}>
            <Typography variant="h6">{new Date(log.date).toLocaleDateString()}</Typography>
            {log.meals.map((meal, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body1" component="p">
                  <strong>{meal.name}</strong>: {meal.totalCalories} calories
                </Typography>
                {meal.foodItems.map((foodItem, idx) => (
                  <Typography key={idx} variant="body2" component="p">
                    - {foodItem.name}: {foodItem.calories} calories, {foodItem.quantity} serving(s)
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        ))
      ) : (
        <Typography>No nutrition logs yet.</Typography>
      )}
    </Paper>
  );
};

export default NutritionList;
