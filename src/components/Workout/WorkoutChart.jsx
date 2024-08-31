import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, Typography, CircularProgress, Divider } from "@mui/material";
import { getWorkouts } from "../../services/workoutService";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WorkoutBarChart = ({ chartType }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState("");

  const generateHourlyLabels = () => {
    const labels = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      labels.push(hour);
    }
    return labels;
  };

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await getWorkouts();
        const workoutLogs = response.data;

        if (chartType === "today") {
          const today = new Date().toLocaleDateString();
          const todayLogs = workoutLogs.filter(
            (log) => new Date(log.createdAt).toLocaleDateString() === today
          );

          const hourlyCalories = Array(24).fill(0);
          todayLogs.forEach((log) => {
            const hour = new Date(log.createdAt).getHours();
            const caloriesBurned = log.exercises.reduce(
              (total, exercise) => total + exercise.caloriesBurned,
              0
            );
            hourlyCalories[hour] += caloriesBurned;
          });

          const totalCalories = hourlyCalories.reduce(
            (sum, value) => sum + value,
            0
          );
          const averageCalories = totalCalories / (todayLogs.length || 1);
          const peakHour = hourlyCalories.indexOf(Math.max(...hourlyCalories));
          const peakHourLabel =
            peakHour < 10 ? `0${peakHour}:00` : `${peakHour}:00`;

          const data = {
            labels: generateHourlyLabels(),
            datasets: [
              {
                label: "Calories Burned Today",
                data: hourlyCalories,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          };

          const options = {
            responsive: true,
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Time of Day",
                },
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Calories Burned",
                },
                ticks: {
                  callback: (value) => `${value} kcal`,
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw} kcal`,
                },
              },
            },
          };

          setChartData({ data, options });
          setAnalysis(`<strong>Total Calories Burned Today:</strong> ${totalCalories.toFixed(2)} kcal<br />
          <strong>Average Calories Per Exercise:</strong> ${averageCalories.toFixed(2)} kcal\n<br />
                      <strong>Peak Workout Hour:</strong> ${peakHourLabel}`);
        } else if (chartType === "overall") {
          const groupedByDate = workoutLogs.reduce((acc, log) => {
            const date = new Date(log.createdAt).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(log);
            return acc;
          }, {});

          const dates = Object.keys(groupedByDate);
          const caloriesPerDate = dates.map((date) =>
            groupedByDate[date].reduce(
              (total, log) =>
                total +
                log.exercises.reduce(
                  (exerciseTotal, exercise) =>
                    exerciseTotal + exercise.caloriesBurned,
                  0
                ),
              0
            )
          );

          const totalCalories = caloriesPerDate.reduce(
            (sum, value) => sum + value,
            0
          );
          const averageCalories = totalCalories / caloriesPerDate.length;
          const peakDate =
            dates[caloriesPerDate.indexOf(Math.max(...caloriesPerDate))];

          const data = {
            labels: dates,
            datasets: [
              {
                label: "Total Calories Burned",
                data: caloriesPerDate,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          };

          const options = {
            responsive: true,
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Date",
                },
                ticks: {
                  autoSkip: false,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Calories Burned",
                },
                ticks: {
                  callback: (value) => `${value} kcal`,
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw} kcal`,
                },
              },
            },
          };

          setChartData({ data, options });
          setAnalysis(`<strong>Total Calories Burned:</strong> ${totalCalories.toFixed(2)} kcal<br />
          <strong>Average Calories Per Day:</strong> ${averageCalories.toFixed(2)} kcal<br />
          <strong></strong>Peak Workout Date:</strong> ${peakDate}`);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching workout data");
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [chartType]);

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h6" gutterBottom>
        {chartType === "today"
          ? "Today's Workout Data"
          : "Overall Workout Data"}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {chartData && (
            <Bar data={chartData.data} options={chartData.options} />
          )}
          <Divider style={{ margin: "16px 0" }} />
          <Typography
            variant="body1"
            component="div"
            dangerouslySetInnerHTML={{ __html: analysis }}
          />
        </>
      )}
    </Paper>
  );
};

export default WorkoutBarChart;
