
import React from "react";
import Chart from "react-apexcharts";

export default function DailyTimesheetTrend({ data }) {
  if (!data || data.length === 0)
    return (
      <div className="bg-white rounded-xl p-6 shadow border text-center text-gray-500">
        No daily timesheet data available
      </div>
    );

  const sorted = [...data].sort((a, b) => Number(a.day) - Number(b.day));

  function convertToHours(time) {
    if (!time) return 0;
    const [h, m, s] = time.split(":").map(Number);
    return Number((h + m / 60 + s / 3600).toFixed(2));
  }

  const days = sorted.map((d) => d.day);
  const hours = sorted.map((d) => convertToHours(d.hours));

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    dataLabels: { enabled: false },

    stroke: {
      curve: "smooth",
      width: 2.5,
      colors: ["#4F46E5"], // modern indigo
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#4F46E5",
            opacity: 0.4,
          },
          {
            offset: 100,
            color: "#4F46E5",
            opacity: 0.05,
          },
        ],
      },
    },

    markers: {
      size: 4,
      colors: ["#ffffff"],
      strokeColors: "#4F46E5",
      strokeWidth: 2,
      hover: { size: 6 },
    },

    xaxis: {
      categories: days,
      labels: { style: { fontSize: "12px" } },
      axisBorder: { show: false },
    },

    yaxis: {
      min: 0,
      labels: {
        style: { fontSize: "12px", fontWeight: 500 },
      },
      title: {
        text: "Hours",
        style: { fontSize: 14, fontWeight: 600 },
      },
    },

    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} hrs`,
      },
    },
  };

  const series = [
    {
      name: "Hours Logged",
      data: hours,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-[16px] font-semibold mb-3">Daily Time Logged</h2>
      <Chart options={options} series={series} type="area" height={320} />
    </div>
  );
}
