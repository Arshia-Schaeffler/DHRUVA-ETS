
import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";

const TeamWorkloadSummary = ({ data = [] }) => {
  // Expected incoming data: [{ Name: "Alice", ProjectCount: 4 }, ...]
  const series = useMemo(() => {
    return [
      {
        name: "Projects",
        data: data.map((d) => Number(d.ProjectCount) || 0),
      },
    ];
  }, [data]);

  const options = useMemo(() => ({
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 500 },
      zoom: { enabled: false },
       offsetY: 50,  //Chart ko thoda neeche shift karega
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: data.map((d) => d.Name || "—"), labels: { rotate: -20, style: { fontSize: "12px" } } },
    yaxis: { tickAmount: 4 },
    tooltip: { theme: "light" },
    colors: ["#4f46e5"],
    grid: { borderColor: "#e6e6e6",
      padding: {
      top: -5,
      bottom: 10, 
    },
     },
    responsive: [
      { breakpoint: 1024, options: { plotOptions: { bar: { columnWidth: "60%" } } } },
      { breakpoint: 640, options: { plotOptions: { bar: { columnWidth: "70%" } } } },
    ],
  }), [data]);

  return (
    <motion.section
      className="bg-white rounded-2xl p-5 shadow-md border"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Team Workload Summary</h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No workload data available</p>
      ) : (
        <div className="w-full h-[320px]">
          <Chart options={options} series={series} type="bar" height="100%" />
        </div>
      )}
    </motion.section>
  );
};

export default TeamWorkloadSummary;

