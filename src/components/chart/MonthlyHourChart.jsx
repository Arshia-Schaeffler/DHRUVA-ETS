import React from "react";
import Chart from "react-apexcharts";

const MonthlyHoursApexChart = ({ data }) => {
 
  // Sort + Round Hours
 
  const sorted = [...data].sort((a, b) => Number(a.day) - Number(b.day));

  const days = sorted.map((d) => d.day);
  const hours = sorted.map((d) => Number(d.hours.toFixed(2)));

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    markers: {
      size: 5,
    },

    xaxis: {
      categories: days,
      title: {
        text: "Day of Month",
        style: { fontSize: "14px", fontWeight: 600 },
      },
    },

    yaxis: {
      title: {
        text: "Hours Logged",
        style: { fontSize: "14px", fontWeight: 600 },
      },
      decimalsInFloat: 0,
      min: 0,
    },

    tooltip: {
      y: {
        formatter: (val) => `${val} hrs`,
      },
    },

    grid: {
      strokeDashArray: 4,
    },

    colors: ["#22c55e"], // green
  };

  const chartSeries = [
    {
      name: "Hours",
      data: hours,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">Monthly Timesheet Trend</h2>
      <Chart options={chartOptions} series={chartSeries} type="line" height={330} />
    </div>
  );
};

export default MonthlyHoursApexChart;
