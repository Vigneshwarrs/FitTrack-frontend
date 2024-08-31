import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, addDays } from "date-fns";
import { getGoals, deleteGoal } from "../../services/goalService";

const GoalList = ({ onGoalUpdated }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await getGoals();
        setGoals(response.data);
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Error fetching goals.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [onGoalUpdated]);

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setSnackbarMessage("Goal deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onGoalUpdated();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error deleting goal. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Your Current Goals
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : goals.length > 0 ? (
        <List>
          {goals.map((goal) => {
            const startDate = format(new Date(goal.createdAt), "MMM d, yyyy");
            const deadline = goal.duration
              ? format(
                  addDays(new Date(goal.createdAt), parseInt(goal.duration)),
                  "MMM d, yyyy"
                )
              : "N/A";

            return (
              <ListItem
                key={goal._id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteGoal(goal._id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={goal.type.toUpperCase()}
                  secondary={`Start Date: ${startDate}, Deadline: ${deadline}${
                    goal.type === "weight" ? ` Target Weight: ${goal.target}` : ""
                  }${goal.type === "strength" ? ` Muscle Group: ${goal.muscleGroup} Sets: ${goal.sets} Reps: ${goal.reps}` : ""}${
                    goal.type === "cardio" ? ` Distance: ${goal.distance} m Duration: ${goal.duration}` : ""
                  }`}
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography>No goals set yet.</Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GoalList;
