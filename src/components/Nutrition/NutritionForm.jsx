import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, IconButton, Paper, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { logNutrition } from '../../services/nutritionService';

const NutritionForm = ({ onSubmitSuccess }) => {
  const initialValues = {
    meals: [
      {
        name: '',
        foodItems: [
          {
            name: '',
            calories: '',
            quantity: '',
          },
        ],
        totalCalories: '',
      },
    ],
  };

  const validationSchema = Yup.object({
    meals: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Required'),
        totalCalories: Yup.number().required('Required').positive('Must be positive'),
        foodItems: Yup.array().of(
          Yup.object({
            name: Yup.string().required('Required'),
            calories: Yup.number().required('Required').positive('Must be positive'),
            quantity: Yup.number().required('Required').positive('Must be positive'),
          })
        ),
      })
    ),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await logNutrition(values);
      onSubmitSuccess();
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h6" gutterBottom>
        Log Nutrition
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FieldArray name="meals">
              {({ push, remove }) => (
                <div>
                  {values.meals.map((meal, mealIndex) => (
                    <Box key={mealIndex} mb={3} p={2} border={1} borderRadius={1}>
                      <Typography variant="h6">Meal {mealIndex + 1}</Typography>
                      <Box mb={2}>
                        <Field
                          name={`meals[${mealIndex}].name`}
                          as={TextField}
                          label="Meal Name"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                        <ErrorMessage name={`meals[${mealIndex}].name`} component="p" style={{ color: 'red' }} />
                      </Box>
                      <FieldArray name={`meals[${mealIndex}].foodItems`}>
                        {({ push, remove }) => (
                          <div>
                            {meal.foodItems.map((_, foodIndex) => (
                              <Box key={foodIndex} mb={2} p={2} border={1} borderRadius={1}>
                                <Field
                                  name={`meals[${mealIndex}].foodItems[${foodIndex}].name`}
                                  as={TextField}
                                  label="Food Name"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                />
                                <ErrorMessage name={`meals[${mealIndex}].foodItems[${foodIndex}].name`} component="p" style={{ color: 'red' }} />
                                <Field
                                  name={`meals[${mealIndex}].foodItems[${foodIndex}].calories`}
                                  as={TextField}
                                  label="Calories"
                                  type="number"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                />
                                <ErrorMessage name={`meals[${mealIndex}].foodItems[${foodIndex}].calories`} component="p" style={{ color: 'red' }} />
                                <Field
                                  name={`meals[${mealIndex}].foodItems[${foodIndex}].quantity`}
                                  as={TextField}
                                  label="Quantity"
                                  type="number"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                />
                                <ErrorMessage name={`meals[${mealIndex}].foodItems[${foodIndex}].quantity`} component="p" style={{ color: 'red' }} />
                                <IconButton
                                  color="secondary"
                                  onClick={() => remove(foodIndex)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ))}
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => push({ name: '', calories: '', quantity: '' })}
                            >
                              Add Food Item
                            </Button>
                          </div>
                        )}
                      </FieldArray>
                      <Box mb={2}>
                        <Field
                          name={`meals[${mealIndex}].totalCalories`}
                          as={TextField}
                          label="Total Calories"
                          type="number"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                        <ErrorMessage name={`meals[${mealIndex}].totalCalories`} component="p" style={{ color: 'red' }} />
                      </Box>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => remove(mealIndex)}
                      >
                        Remove Meal
                      </Button>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="center" marginTop={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => push({ name: '', foodItems: [{ name: '', calories: '', quantity: '' }], totalCalories: '' })}
                  >
                    Add Meal
                  </Button>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    style={{ marginTop: 16 }}
                  >
                    Log Nutrition
                  </Button>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default NutritionForm;
