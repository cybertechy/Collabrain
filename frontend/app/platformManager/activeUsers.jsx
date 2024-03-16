import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
 
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
 
const ChartComponent = ({ isMonthly }) => {
  const [monthlyActiveUsers, setMonthlyActiveUsers] = useState(0);
  const [weeklyActiveUsers, setWeeklyActiveUsers] = useState(0);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/stats/active-users');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setMonthlyActiveUsers(jsonData.monthly?.activeUserCount || 0);
        setWeeklyActiveUsers(jsonData.weekly?.activeUserCount || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMonthlyActiveUsers(0);
        setWeeklyActiveUsers(0);
      }
    };
 
    fetchData();
  }, []);
 
  const options = {
    colors: ["rgb(164, 101, 241)", "#FF0000"], // Color for monthly and weekly bars
    chart: {
      type: "bar",
      height: "100%",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 8,
      },
    },
    xaxis: {
      categories: ['Monthly', 'Weekly'],
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Active Users",
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };
 
  const series = [
    {
      name: "Active Users",
      data: [monthlyActiveUsers, weeklyActiveUsers],
    },
  ];
 
  return (
<div id="column-chart" className="h-full">
<ApexCharts  width="100%" options={options} series={series} type="bar" height="100%" />
</div>
  );
};
 
export default ChartComponent;

