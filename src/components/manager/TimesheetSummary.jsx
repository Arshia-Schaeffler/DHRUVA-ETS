import React, { useState } from "react";
import Chart from "react-apexcharts";
import { MdBarChart, MdPieChart, MdInsights } from "react-icons/md";

export default function TimesheetSummary({ summary }) {
  const [view, setView] = useState("bar");
  const barData = summary?.byProject || [];
  const pieData = summary?.byStatus || [];

  // --- Chart Config ---
  const barChart = {
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
        animations: { easing: "easeinout", speed: 800 },

        offsetY: 0,
        padding: {
          bottom: 0
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "45%",
          // distributed: true,
        },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        offsetY: 5,
        markers: { radius: 6 },
        labels: { colors: "#6b7280" },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: barData.map((p) =>
          p.projectName.length > 12
            ? p.projectName.slice(0, 12) + "..."
            : p.projectName
        ),
        labels: {
          style: { fontSize: "12px", colors: "#6b7280", fontWeight: 500 },
          offsetY: 5,
        },
      },
      yaxis: {
        labels: {
          style: { fontSize: "12px", colors: "#6b7280" },
        },
        title: {
          text: "Hours",
          style: { fontSize: "12px", color: "#6b7280" },
        },
      },
      tooltip: {
        theme: "light",
        style: { fontSize: "13px" },
        y: { formatter: (val) => `${val.toFixed(1)} hrs` },
        marker: { show: true },

      },
      colors: ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444"],
    },
    series: [
      {
        name: "Total Hours",
        data: barData.map((p) => p.totalHours),
      },
    ],
  };

  const pieChart = {
    options: {
      chart: {
        type: "donut",
        toolbar: { show: false },
        animations: { easing: "easeinout", speed: 800 },


        // fix extra gap
        offsetY: 10,
        padding: {
          bottom: 10
        }
      },
      labels: pieData.map((p) => p.name),
      legend: {
        position: "bottom",
        fontSize: "13px",
        labels: { colors: "#6b7280" },
        markers: { radius: 8 },
        offsetY: 10,
      },
      tooltip: {
        theme: "light",
        y: { formatter: (val) => `${val} hrs` },
      },
      stroke: { width: 1, colors: ["#fff"] },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                fontSize: "13px",
                color: "#6b7280",
                formatter: () =>
                  pieData.reduce((acc, cur) => acc + cur.value, 0) + " hrs",
              },
            },
          },
        },
      },
      dataLabels: {
        style: { fontSize: "12px", fontWeight: 600 },
        formatter: (val) => `${val.toFixed(0)}%`,
      },
      colors: ["#22c55e", "#facc15", "#ef4444", "#3b82f6", "#a855f7"],
    },
    series: pieData.map((p) => p.value),
  };

  // --- UI ---
  return (
    <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <MdInsights className="text-green-600" size={22} />
          <span>Timesheet Summary</span>
        </h3>

        {/* Toggle Buttons */}
        <div className="flex gap-2">
          {[
            { key: "bar", icon: <MdBarChart size={18} />, label: "Bar" },
            { key: "pie", icon: <MdPieChart size={18} />, label: "Pie" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-200 ${view === key
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex justify-around mb-4 text-sm font-semibold">
        <span className="text-green-600">
          Approved: {summary?.approved?.toFixed(1) || 0} hrs
        </span>
        <span className="text-yellow-500">
          Pending: {summary?.pending?.toFixed(1) || 0} hrs
        </span>
        <span className="text-red-500">
          Rejected: {summary?.rejected?.toFixed(1) || 0} hrs
        </span>
      </div>

      {/* Chart Section */}
      {/* <div className="min-h-[340px] flex items-center justify-center"> */}
      <div className="h-[300px] w-full  items-center justify-center">

        {view === "bar" ? (
          barData.length > 0 ? (
            <Chart
              options={barChart.options}
              series={barChart.series}
              type="bar"
              height={320}
              width="100%"
            />
          ) : (
            <div className="text-gray-400 text-sm">
              No project data available
            </div>
          )
        ) : pieData.length > 0 ? (
          <Chart
            options={pieChart.options}
            series={pieChart.series}
            type="donut"
            height={320}
            width="100%"
          />
        ) : (
          <div className="text-gray-400 text-sm">
            No status data available
          </div>
        )}
      </div>
    </div>
  );
}
