import React, { useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import GoalForm from './GoalForm';
import GoalList from './GoalList';

const GoalManagement = () => {
  const [goalUpdated, setGoalUpdated] = useState(false);

  const handleGoalUpdated = () => {
    setGoalUpdated(!goalUpdated);
  };

  return (
    <Container maxWidth="md" style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Your Fitness Goals
      </Typography>
      
      <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
        <GoalForm onSubmitSuccess={handleGoalUpdated} />
      </Paper>

      <Paper elevation={3} style={{ padding: '1rem' }}>
        <GoalList onGoalUpdated={handleGoalUpdated} />
      </Paper>
    </Container>
  );
};

export default GoalManagement;
