import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import NutritionList from '../components/Nutrition/NutritionList';
import WorkoutList from '../components/Workout/WorkoutList';
import DietSuggestions from '../components/DietSuggestions';
import ExerciseSuggestions from '../components/ExerciseSuggestions';
import NutritionChart from '../components/Nutrition/NutritionChart';
import WorkoutChart from '../components/Workout/WorkoutChart';
import WorkoutDistributionChart from '../components/Workout/WorkoutDistributionChart';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Welcome to Your Fitness Tracker
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h2">Fitness Goals</Typography>
              {/* Display fitness goals summary */}
              <DietSuggestions />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h2">Workout Summary</Typography>
              {/* Display workout summary */}
              <WorkoutList />
              <WorkoutChart />
              <WorkoutDistributionChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h2">Nutrition Overview</Typography>
              {/* Display nutrition overview */}
              <NutritionList />
              <NutritionChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h2">Suggestions</Typography>
              {/* Display diet and exercise suggestions */}
              <DietSuggestions />
              <ExerciseSuggestions />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
