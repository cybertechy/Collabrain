import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import dynamic from 'next/dynamic';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const DashboardCard = () => {
  const [dbUsage, setDbUsage] = useState(0);

  useEffect(() => {

    axios.get(SERVERLOCATION + '/api/dbUsage')
      .then(response => {
        setDbUsage(response.data.count);
      })
      .catch(error => {
        console.error('Error fetching database usage:', error);
      });
  }, []); 

  const chartOptions = {
    series: [
      {
        name: "Database Storage",
        data: [dbUsage],
        color: "#F05252",
      }
    ],
    chart: {
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      }
    },
    xaxis: {
      categories: ["Storage"],
    },
    
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "100%",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      formatter: function (value) {
        return value + " GB"
      }
    },
    fill: {
      opacity: 1,
    }
  };

  return (
    <div className="max-w-screen-lg w-11/12 bg-white rounded-lg  p-4 md:p-6">
      <ApexCharts width="100%" options={chartOptions} series={chartOptions.series} type="bar" height={chartOptions.chart.height} />

      {dbUsage !== null && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Database Usage: {dbUsage}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;

