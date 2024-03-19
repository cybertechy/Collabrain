import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const PieChart = () => {
  const [userMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/stats/random-user-metrics'); 
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
              position: 'bottom', 
            },
          },
          maintainAspectRatio: false,
        },
      };

      const chartPie = new Chart(document.getElementById("chartPie"), configPie);

      return () => {
        chartPie.destroy(); 
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
