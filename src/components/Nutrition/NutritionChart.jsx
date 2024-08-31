import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../utils/api';
import { Paper, Typography, CircularProgress, Divider } from '@mui/material';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NutritionChart = ({ chartType }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState('');

  const generateHourlyLabels = () => {
    const labels = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      labels.push(hour);
    }
    return labels;
  };

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await api.get('/api/nutrition');
        const nutritionLogs = response.data;

        if (chartType === 'today') {
          const today = new Date().toLocaleDateString();
          const todayLogs = nutritionLogs.filter(log =>
            new Date(log.createdAt).toLocaleDateString() === today
          );

          const hourlyLabels = generateHourlyLabels();
          const hourlyCalories = Array(24).fill(0);
          todayLogs.forEach(log => {
            const hour = new Date(log.createdAt).getHours();
            const calories = log.meals.reduce((total, meal) => total + meal.totalCalories, 0);
            hourlyCalories[hour] += calories;
          });

          const totalCalories = hourlyCalories.reduce((sum, value) => sum + value, 0);
          const averageCalories = totalCalories / (todayLogs.length || 1);
          const peakHour = hourlyCalories.indexOf(Math.max(...hourlyCalories));
          const peakHourLabel = peakHour < 10 ? `0${peakHour}:00` : `${peakHour}:00`;

          const data = {
            labels: hourlyLabels,
            datasets: [
              {
                label: 'Calories Consumed Today',
                data: hourlyCalories,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
              },
            ],
          };

          const options = {
            responsive: true,
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Time of Day',
                },
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Calories Consumed',
                },
                ticks: {
                  callback: (value) => `${value} kcal`,
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw} kcal`,
                },
              },
            },
          };

          setChartData({ data, options });
          setAnalysis(` <strong>Total Calories Consumed Today:</strong> ${totalCalories.toFixed(2)} kcal<br />
            <strong>Average Calories Per Meal:</strong> ${averageCalories.toFixed(2)} kcal<br />
            <strong>Peak Consumption Hour:</strong> ${peakHourLabel}`);
        } else if (chartType === 'overall') {
          const groupedByDate = nutritionLogs.reduce((acc, log) => {
            const date = new Date(log.createdAt).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(log);
            return acc;
          }, {});

          const dates = Object.keys(groupedByDate);
          const caloriesPerDate = dates.map(date =>
            groupedByDate[date].reduce((total, log) =>
              total + log.meals.reduce((mealTotal, meal) => mealTotal + meal.totalCalories, 0), 0)
          );

          const totalCalories = caloriesPerDate.reduce((sum, value) => sum + value, 0);
          const averageCalories = totalCalories / caloriesPerDate.length;
          const peakDate = dates[caloriesPerDate.indexOf(Math.max(...caloriesPerDate))];

          const data = {
            labels: dates,
            datasets: [
              {
                label: 'Total Calories Consumed',
                data: caloriesPerDate,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
              },
            ],
          };

          const options = {
            responsive: true,
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Date',
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
                  text: 'Calories Consumed',
                },
                ticks: {
                  callback: (value) => `${value} kcal`,
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw} kcal`,
                },
              },
            },
          };

          setChartData({ data, options });
          setAnalysis(`<strong>Total Calories Consumed:</strong> ${totalCalories.toFixed(2)} kcal<br />
            <strong>Average Calories Per Day:</strong> ${averageCalories.toFixed(2)} kcal<br />
            <strong>Peak Consumption Date:</strong> ${peakDate}`);
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching nutrition data');
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [chartType]);

  return (
    <Paper elevation={3} style={{ padding: 16, margin: 16 }}>
      <Typography variant="h6" gutterBottom>
        {chartType === 'today' ? "Today's Nutrition Data" : 'Overall Nutrition Data'}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {chartData && <Bar data={chartData.data} options={chartData.options} />}
          <Divider style={{ margin: '16px 0' }} />
          <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: analysis }} />
        </>
      )}
    </Paper>
  );
};

export default NutritionChart;
