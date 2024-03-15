import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const PieChart = () => {
  const [userMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        const response = await fetch('/random-user-metrics'); // Assuming this is the endpoint to fetch user metrics
        if (!response.ok) {
          throw new Error('Failed to fetch user metrics');
        }
        const data = await response.json();
        setUserMetrics(data);
      } catch (error) {
        console.error('Failed to fetch user metrics:', error);
      }
    };

    fetchUserMetrics();
  }, []);

  useEffect(() => {
    if (userMetrics) {
      const dataPie = {
        labels: ["Score", "Monthly Message Count", "Time Spent"],
        datasets: [
          {
            data: [userMetrics.score || 0, userMetrics.monthlyMessageCount || 0, userMetrics.timeSpent || 0],
            backgroundColor: [
              "rgb(133, 105, 241)",
              "rgb(164, 101, 241)",
              "rgb(101, 143, 241)",
            ],
            hoverOffset: 4,
          },
        ],
      };

      const configPie = {
        type: "pie",
        data: dataPie,
        options: {
          plugins: {
            legend: {
              position: 'bottom', // Display legend below the chart
            },
          },
          maintainAspectRatio: false, // Make the chart responsive
        },
      };

      const chartPie = new Chart(document.getElementById("chartPie"), configPie);

      return () => {
        chartPie.destroy(); // Clean up chart instance to prevent memory leaks
      };
    }
  }, [userMetrics]);

  return (
    <div className="overflow-hidden">
      <canvas id="chartPie"></canvas>
    </div>
  );
};

export default PieChart;