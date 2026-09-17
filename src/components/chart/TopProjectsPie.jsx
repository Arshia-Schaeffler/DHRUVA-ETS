
import React from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";

export default function TopProjectsPie({ data }) {
  if (!data || data.length === 0)
    return (
      <div className="bg-white rounded-xl p-6 shadow border text-center text-gray-500">
        No project data available
      </div>
    );

  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.name);

  const options = {
    labels,
    chart: {
      type: "donut",
      animations: { enabled: true, speed: 600 },
      toolbar: { show: false },
      height: 320, 
    },
    stroke: { width: 0 },
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: { colors: "#333" },
      markers: { width: 10, height: 10, radius: 12 },
      itemMargin: { horizontal: 8, vertical: 0 },
    },
    tooltip: {
      y: { formatter: (val) => `${val} hrs` },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%", 
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => series.reduce((a, b) => a + b, 0).toFixed(2) + " hrs",
              fontSize: "16px",
              fontWeight: 600,
            },
          },
        },
      },
    },
    colors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6"],
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", fontWeight: "bold", colors: ["#fff"] },
      dropShadow: { enabled: false }, 
    },
    grid: { padding: { top: 10, bottom: 0, left: 0, right: 0 } },
    responsive: [
      {
        breakpoint: 1024,
        options: { chart: { height: 300 } },
      },
    ],
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl p-6 shadow border  flex flex-col"
    >
      <h2 className="text-lg font-semibold mb-3">Top Project Breakdown</h2>
      <div className="flex-1">
        <Chart options={options} series={series} type="donut" height={320} />
      </div>
    </motion.div>
  );
}
