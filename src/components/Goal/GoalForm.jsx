import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { setGoal } from "../../services/goalService";

// Validation schema for the goal type selection
const goalTypeValidationSchema = Yup.object({
  type: Yup.string().required("Goal type is required"),
});

// Dynamic validation schema based on goal type
const getAdditionalInputsValidationSchema = (goalType) =>
  Yup.object().shape({
    target: Yup.lazy(() =>
      !["flexibility", "endurance", "strength", "cardio", "hydration", "nutrition", "recovery"].includes(goalType)
        ? Yup.string().required("Target value is required")
        : Yup.mixed().notRequired()
    ),
    duration: Yup.lazy(() =>
      ["cardio", "endurance", "recovery", "hydration"].includes(goalType)
        ? Yup.string().required("Duration is required")
        : Yup.mixed().notRequired()
    ),
    weight: Yup.lazy(() =>
      goalType === "weight"
        ? Yup.number().required("Weight is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    units: Yup.lazy(() =>
      goalType === "weight" || goalType === "hydration"
        ? Yup.string().required("Units are required")
        : Yup.mixed().notRequired()
    ),
    muscleGroup: Yup.lazy(() =>
      goalType === "strength"
        ? Yup.string().required("Muscle group is required")
        : Yup.mixed().notRequired()
    ),
    reps: Yup.lazy(() =>
      goalType === "strength"
        ? Yup.number().required("Reps are required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    sets: Yup.lazy(() =>
      goalType === "strength"
        ? Yup.number().required("Sets are required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    distance: Yup.lazy(() =>
      ["cardio", "endurance"].includes(goalType)
        ? Yup.number().required("Distance is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    durationType: Yup.lazy(() =>
      ["cardio", "endurance"].includes(goalType)
        ? Yup.string().required("Duration type is required")
        : Yup.mixed().notRequired()
    ),
    stretchDuration: Yup.lazy(() =>
      goalType === "flexibility"
        ? Yup.number().required("Stretch duration is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    balanceExercises: Yup.lazy(() =>
      goalType === "balance"
        ? Yup.number().required("Number of balance exercises is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    mobilityExercises: Yup.lazy(() =>
      goalType === "mobility"
        ? Yup.number().required("Number of mobility exercises is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    recoverySessions: Yup.lazy(() =>
      goalType === "recovery"
        ? Yup.number().required("Number of recovery sessions is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    waterIntake: Yup.lazy(() =>
      goalType === "hydration"
        ? Yup.number().required("Water intake is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
    nutrientType: Yup.lazy(() =>
      goalType === "nutrition"
        ? Yup.string().required("Nutrient type is required")
        : Yup.mixed().notRequired()
    ),
    nutrientAmount: Yup.lazy(() =>
      goalType === "nutrition"
        ? Yup.number().required("Nutrient amount is required").positive("Must be a positive number")
        : Yup.mixed().notRequired()
    ),
  });

const GoalForm = ({ onSubmitSuccess }) => {
  const [step, setStep] = useState(1);
  const [goalType, setGoalType] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const initialValuesStep1 = {
    type: "",
  };

  const initialValuesStep2 = {
    target: "",
    duration: "",
    weight: "",
    reps: "",
    sets: "",
    distance: "",
    durationType: "",
    stretchDuration: "",
    balanceExercises: "",
    mobilityExercises: "",
    recoverySessions: "",
    muscleGroup: "",
    units: "",
    waterIntake: "",
    nutrientType: "",
    nutrientAmount: "",
  };

  const handleStep1Submit = (values) => {
    setGoalType(values.type);
    setStep(2);
  };

  const handleStep2Submit = async (values, { setSubmitting }) => {
    try {
      const updateValues = {
        ...values,
        type: goalType,
        target: values.type === 'weight' ? `${values.weight} ${values.units}` : values.target,
        duration: values.type === 'cardio' || values.type === 'endurance' ? `${values.duration} ${values.durationType}` : values.duration,
        distance: values.type === 'cardio' || values.type === 'endurance' ? `${values.distance} ${values.units}` : values.distance,
      };
      await setGoal(updateValues);
      setSnackbarMessage("Goal set successfully!");
      setSnackbarSeverity("success");
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      setSnackbarMessage("Error setting goal. Please try again.");
      setSnackbarSeverity("error");
      console.error(error);
    }
    setSnackbarOpen(true);
    setSubmitting(false);
    setStep(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Set a New Goal
      </Typography>

      {step === 1 && (
        <Formik
          initialValues={initialValuesStep1}
          validationSchema={goalTypeValidationSchema}
          onSubmit={handleStep1Submit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl fullWidth margin="normal">
                <InputLabel id="goal-type-label">Goal Type</InputLabel>
                <Field
                  as={Select}
                  name="type"
                  labelId="goal-type-label"
                  label="Goal Type"
                >
                  <MenuItem value="">Select a goal type</MenuItem>
                  <MenuItem value="weight">Weight</MenuItem>
                  <MenuItem value="strength">Strength</MenuItem>
                  <MenuItem value="cardio">Cardio</MenuItem>
                  <MenuItem value="flexibility">Flexibility</MenuItem>
                  <MenuItem value="endurance">Endurance</MenuItem>
                  <MenuItem value="balance">Balance</MenuItem>
                  <MenuItem value="mobility">Mobility</MenuItem>
                  <MenuItem value="recovery">Recovery</MenuItem>
                  <MenuItem value="hydration">Hydration</MenuItem> {/* New Goal Type */}
                  <MenuItem value="nutrition">Nutrition</MenuItem> {/* New Goal Type */}
                </Field>
                <FormHelperText>
                  <ErrorMessage name="type" component="p" style={{ color: "red" }} />
                </FormHelperText>
              </FormControl>
              <Box mb={2} display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Next
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}

      {step === 2 && (
        <Formik
          initialValues={{ ...initialValuesStep2, type: goalType }}
          validationSchema={getAdditionalInputsValidationSchema(goalType)}
          onSubmit={handleStep2Submit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Render fields based on goalType */}
              {goalType !== "weight" &&
                goalType !== "strength" &&
                goalType !== "flexibility" &&
                goalType !== "endurance" &&
                goalType !== "cardio" &&
                goalType !== "recovery" &&
                goalType !== "hydration" &&
                goalType !== "nutrition" && (
                  <Box mb={2}>
                    <Field
                      name="target"
                      label="Target Value"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="target" component="p" style={{ color: "red" }} />
                  </Box>
                )}

              {goalType === "weight" && (
                <>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Field
                      name="target"
                      label="Target Weight (e.g., 90)"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <Field
                      name="units"
                      label="Unit"
                      variant="outlined"
                      margin="normal"
                      select
                      as={TextField}
                      sx={{ marginLeft: 2, minWidth: 120 }}
                    >
                      <MenuItem value="kg">kg</MenuItem>
                      <MenuItem value="lbs">lbs</MenuItem>
                    </Field>
                    <ErrorMessage name="target" component="p" style={{ color: "red" }} />
                    <ErrorMessage name="units" component="p" style={{ color: "red" }} />
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Field
                      name="weight"
                      label="Current Weight (e.g., 70)"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <Field
                      name="units"
                      label="Unit"
                      variant="outlined"
                      margin="normal"
                      select
                      as={TextField}
                      sx={{ marginLeft: 2, minWidth: 120 }}
                    >
                      <MenuItem value="kg">kg</MenuItem>
                      <MenuItem value="lbs">lbs</MenuItem>
                    </Field>
                    <ErrorMessage name="weight" component="p" style={{ color: "red" }} />
                    <ErrorMessage name="units" component="p" style={{ color: "red" }} />
                  </Box>
                </>
              )}

              {goalType === "strength" && (
                <>
                  <Box mb={2}>
                    <Field
                      name="muscleGroup"
                      label="Muscle Group"
                      variant="outlined"
                      margin="normal"
                      select
                      as={TextField}
                      fullWidth
                    >
                      <MenuItem value="chest">Chest</MenuItem>
                      <MenuItem value="back">Back</MenuItem>
                      <MenuItem value="shoulders">Shoulders</MenuItem>
                      <MenuItem value="biceps">Biceps</MenuItem>
                      <MenuItem value="triceps">Triceps</MenuItem>
                    </Field>
                    <ErrorMessage name="muscleGroup" component="p" style={{ color: "red" }} />
                    </Box>
                    <Box mb={2}>
                    <Field
                      name="reps"
                      label="Reps"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="reps" component="p" style={{ color: "red" }} />
                  </Box>
                  <Box mb={2}>
                    <Field
                      name="sets"
                      label="Sets"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="sets" component="p" style={{ color: "red" }} />
                  </Box>
                </>
              )}

              {goalType === "cardio" && (
                <>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Field
                      name="distance"
                      label="Distance (e.g., 5km)"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <Field
                      name="units"
                      label="Units"
                      variant="outlined"
                      margin="normal"
                      as={TextField}
                      select
                      sx={{ marginLeft: 2, minWidth: 120 }}
                    >
                      <MenuItem value="km">km</MenuItem>
                      <MenuItem value="m">m</MenuItem>
                    </Field>
                    <ErrorMessage name="distance" component="p" style={{ color: "red" }} />
                    <ErrorMessage name="units" component="p" style={{ color: "red" }} />
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Field
                      name="duration"
                      label="Duration (e.g., 30)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="duration" component="p" style={{ color: "red" }} />
                    <Field
                      name="durationType"
                      label="Duration Type"
                      variant="outlined"
                      margin="normal"
                      as={TextField}
                      select
                      sx={{ marginLeft: 2, minWidth: 120 }}
                    >
                      <MenuItem value="minutes">Minutes</MenuItem>
                      <MenuItem value="hours">Hours</MenuItem>
                      <MenuItem value="days">Days</MenuItem>
                      <MenuItem value="weeks">Weeks</MenuItem>
                    </Field>
                    <ErrorMessage name="durationType" component="p" style={{ color: "red" }} />
                  </Box>
                </>
              )}
               {goalType === "endurance" && (
                <>
                  <Box mb={2}>
                    <Field
                      name="distance"
                      label="Distance (e.g., 10km)"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage
                      name="distance"
                      component="p"
                      style={{ color: "red" }}
                    />
                  </Box>
                  <Box mb={2}>
                    <Field
                      name="duration"
                      label="Duration (e.g., 30 Minutes)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage
                      name="duration"
                      component="p"
                      style={{ color: "red" }}
                    />
                  </Box>
                </>
              )}

              {/* Other goal types like flexibility, balance, mobility, recovery */}
              {goalType === "flexibility" && (
                <Box mb={2}>
                  <Field
                    name="stretchDuration"
                    label="Stretch Duration (e.g., 20 minutes)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    as={TextField}
                  />
                  <ErrorMessage name="stretchDuration" component="p" style={{ color: "red" }} />
                </Box>
              )}

              {goalType === "balance" && (
                <Box mb={2}>
                  <Field
                    name="balanceExercises"
                    label="Number of Balance Exercises"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    as={TextField}
                  />
                  <ErrorMessage name="balanceExercises" component="p" style={{ color: "red" }} />
                </Box>
              )}

              {goalType === "mobility" && (
                <Box mb={2}>
                  <Field
                    name="mobilityExercises"
                    label="Number of Mobility Exercises"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    as={TextField}
                  />
                  <ErrorMessage name="mobilityExercises" component="p" style={{ color: "red" }} />
                </Box>
              )}

              {goalType === "recovery" && (
                <>
                  <Box mb={2}>
                    <Field
                      name="recoverySessions"
                      label="Number of Recovery Sessions"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="recoverySessions" component="p" style={{ color: "red" }} />
                  </Box>
                  <Box mb={2}>
                    <Field
                      name="duration"
                      label="Duration per Session (e.g., 30 minutes)"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="duration" component="p" style={{ color: "red" }} />
                  </Box>
                </>
              )}

              {goalType === "hydration" && (
                <Box mb={2}>
                  <Field
                    name="waterIntake"
                    label="Daily Water Intake (e.g., 2 liters)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    as={TextField}
                  />
                  <Field
                    name="units"
                    label="Units"
                    variant="outlined"
                    margin="normal"
                    select
                    as={TextField}
                    sx={{ marginLeft: 2, minWidth: 120 }}
                  >
                    <MenuItem value="liters">Liters</MenuItem>
                    <MenuItem value="ml">Milliliters</MenuItem>
                  </Field>
                  <ErrorMessage name="waterIntake" component="p" style={{ color: "red" }} />
                  <ErrorMessage name="units" component="p" style={{ color: "red" }} />
                </Box>
              )}

              {goalType === "nutrition" && (
                <>
                  <Box mb={2}>
                    <Field
                      name="nutrientType"
                      label="Nutrient Type (e.g., Protein)"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      as={TextField}
                    />
                    <ErrorMessage name="nutrientType" component="p" style={{ color: "red" }} />
                  </Box>
                  <Box mb={2}>
                    <Field
                      name="nutrientAmount"
                      label="Daily Intake Amount (e.g., 50 grams)"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      as={TextField}
                    />
                    <ErrorMessage name="nutrientAmount" component="p" style={{ color: "red" }} />
                  </Box>
                </>
              )}

              <Box mb={2} gap={3} display="flex" justifyContent="center">
                <Button onClick={() => setStep(1)} variant="contained" color="secondary">
                  Back
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Set Goal
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GoalForm;
