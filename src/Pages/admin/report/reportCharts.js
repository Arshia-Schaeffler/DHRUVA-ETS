export const buildBarChart = (data = []) => {
  return {
    series: [
      {
        name: "Hours",
        data: data.map((item) => Number(item.totalHours) || 0),
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      xaxis: {
        categories: data.map((item) => item.projectName),
        title: { text: "Projects" },
      },
      yaxis: {
        title: { text: "Total Hours" },
      },
      dataLabels: { enabled: false },
      colors: ["#16a34a"],
    },
  };
};

export const buildDonutChart = (data = []) => {
  return {
    series: data.map((item) => Number(item.totalHours) || 0),
    options: {
      labels: data.map((item) => item.projectName),
      legend: { position: "bottom" },
      colors: ["#22c55e", "#4ade80", "#86efac", "#bbf7d0"],
    },
  };
};
