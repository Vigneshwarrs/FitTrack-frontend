import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, MenuItem, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { logWorkout } from '../../services/workoutService';

const WorkoutForm = ({ onSubmitSuccess }) => {
  const initialValues = {
    exercises: [
      {
        name: '',
        duration: '',
        intensity: '',
        caloriesBurned: '',
      },
    ],
  };

  const validationSchema = Yup.object({
    exercises: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Required'),
        duration: Yup.number().required('Required').positive('Must be positive'),
        intensity: Yup.string().required('Required'),
        caloriesBurned: Yup.number().required('Required').positive('Must be positive'),
      })
    ),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await logWorkout(values);
      onSubmitSuccess();
    } catch (error) {
      console.error("Error submitting workout:", error);
    }
    setSubmitting(false);
  };

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h6" gutterBottom>
        Log Workout
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FieldArray name="exercises">
              {({ push, remove }) => (
                <div>
                  {values.exercises.map((_, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <Typography variant="subtitle1">Exercise {index + 1}</Typography>
                      <div>
                        <Field
                          name={`exercises[${index}].name`}
                          as={TextField}
                          label="Name"
                          fullWidth
                          margin="normal"
                        />
                        <ErrorMessage name={`exercises[${index}].name`} component="div" />
                      </div>
                      <div>
                        <Field
                          name={`exercises[${index}].duration`}
                          as={TextField}
                          type="number"
                          label="Duration (minutes)"
                          fullWidth
                          margin="normal"
                        />
                        <ErrorMessage name={`exercises[${index}].duration`} component="div" />
                      </div>
                      <div>
                        <Field
                          name={`exercises[${index}].intensity`}
                          as={TextField}
                          select
                          label="Intensity"
                          fullWidth
                          margin="normal"
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </Field>
                        <ErrorMessage name={`exercises[${index}].intensity`} component="div" />
                      </div>
                      <div>
                        <Field
                          name={`exercises[${index}].caloriesBurned`}
                          as={TextField}
                          type="number"
                          label="Calories Burned"
                          fullWidth
                          margin="normal"
                        />
                        <ErrorMessage name={`exercises[${index}].caloriesBurned`} component="div" />
                      </div>
                      <Button
                        type="button"
                        variant="outlined"
                        color="error"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => push({ name: '', duration: '', intensity: '', caloriesBurned: '' })}
                  >
                    Add Exercise
                  </Button>
                </div>
              )}
            </FieldArray>
            <Box display="flex" justifyContent="center" marginTop={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Log Workout'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default WorkoutForm;
