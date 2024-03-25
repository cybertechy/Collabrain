import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@material-tailwind/react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const SERVERLOCATION = process.env.NEXT_PUBLIC_SERVER_LOCATION;

const LineChart = ({ teamId }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVERLOCATION}/api/stats/active-members`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setChartData(data);
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [teamId]);

  const chartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Active Members",
        data: chartData.map(entry => entry.activeMembersCount),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: chartData.map(entry => entry.teamId),
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <Card>
      <CardHeader
        floated={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <h2 className="text-base font-semibold"></h2>
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart width={"100%"} {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default LineChart;
