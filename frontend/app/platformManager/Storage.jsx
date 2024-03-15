import React, { useState, useEffect } from 'react';

import axios from 'axios'; 
import dynamic from 'next/dynamic';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const DashboardCard = () => {
  const [dbUsage, setDbUsage] = useState(null);

  useEffect(() => {
    // Fetch database usage count from backend
    axios.get('http://localhost:8080/api/dbUsage')
      .then(response => {
        setDbUsage(response.data.count);

        // Update chart options with fetched database storage data
        const options = {
          series: [
            {
              name: "Media Storage",
              color: "#31C48D",
              data: ["2120"], // Dummy data, replace with actual media storage data if available
            },
            {
              name: "Database Storage",
              data: [response.data.count.toString()], // Use fetched database storage data
              color: "#F05252",
            }
          ],
          chart: {
            sparkline: {
              enabled: false,
            },
            type: "bar",
            width: "100%", // Make the chart width 100% of the container
            height: 200,
            toolbar: {
              show: false,
            }
          },
          fill: {
            opacity: 1,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "100%",
              borderRadius: 6,
              dataLabels: {
                position: "top",
              },
              colors: {
                ranges: [
                  {
                    from: 0,
                    to: 0,
                    color: "#fff"
                  }
                ]
              }
            },
          },
          legend: {
            show: true,
            position: "bottom",
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
          xaxis: {
            labels: {
              show: true,
              style: {
                fontFamily: "Inter, sans-serif",
                cssClass: 'text-xs font-normal fill-black'
              },
              formatter: function(value) {
                return  value + " GB"
              }
            },
            categories: ["Storage"], // Adjust the labels here
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
          },
          yaxis: {
            labels: {
              show: true,
              style: {
                fontFamily: "Inter, sans-serif",
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
              }
            }
          },
          
          fill: {
            opacity: 1,
          }
        };

        if (document.getElementById("bar-chart") && typeof ApexCharts !== 'undefined') {
          const chart = new ApexCharts(document.getElementById("bar-chart"), options);
          chart.render();
        }
      })
      .catch(error => {
        console.error('Error fetching database usage:', error);
      });
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="max-w-screen-lg w-full bg-white rounded-lg shadow p-4 md:p-6">
      <div id="bar-chart"></div>
      {/* Display database usage if available */}
      {dbUsage !== null && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Database Usage: {dbUsage}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
