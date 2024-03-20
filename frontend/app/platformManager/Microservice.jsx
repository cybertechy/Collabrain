import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;
const PieChart = () => {
  const [userMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        const response = await fetch(SERVERLOCATION + '/api/stats/random-user-metrics'); 
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
        labels: ["Video Calling", "Messaging", "ContentMaps", "Documents"],
        datasets: [
          {
            data: [userMetrics.VideoCalling||0, userMetrics.Messaging||0, userMetrics.ContentMaps||0, userMetrics.Documents||0],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(101, 241, 133)"
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
