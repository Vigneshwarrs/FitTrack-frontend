import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, CircularProgress, Paper } from '@mui/material';
import { getDietSuggestions } from '../services/suggestionService';

const DietSuggestions = () => {
  const [diet, setDiet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const response = await getDietSuggestions();
        setDiet(response.data);
      } catch (error) {
        setError('Failed to load diet suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiet();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h5" gutterBottom>Diet Suggestions</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : diet.length > 0 ? (
        <List>
          {diet.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      ) : (
        <Typography>No suggestions available.</Typography>
      )}
    </Paper>
  );
};

export default DietSuggestions;
