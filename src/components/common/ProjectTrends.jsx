// import Chart from "react-apexcharts";

// const ProjectTrends = ({ data }) => {
//   const options = {
//   chart: {
//     type: "area",
//     toolbar: { show: false },
//     zoom: { enabled: false },
//     fontFamily: "Inter, sans-serif",
//   },

//   stroke: {
//     curve: "smooth",
//     width: 2.5,
//   },

//   colors: ["#22c55e", "#3b82f6"], // green + blue

//   fill: {
//     type: "gradient",
//     gradient: {
//       shadeIntensity: 1,
//       opacityFrom: 0.45,
//       opacityTo: 0.05,
//       stops: [0, 90, 100],
//     },
//   },

//   dataLabels: {
//     enabled: false,
//   },

//   xaxis: {
//     categories: data.categories,
//     axisBorder: { show: false },
//     axisTicks: { show: false },
//     labels: {
//       style: {
//         colors: "#9ca3af",
//         fontSize: "12px",
//       },
//     },
//   },

//   yaxis: {
//     tickAmount: 5,
//     labels: {
//       style: {
//         colors: "#9ca3af",
//         fontSize: "12px",
//       },
//     },
//   },

//   grid: {
//     borderColor: "#e5e7eb",
//     strokeDashArray: 4,
//     padding: {
//       left: 10,
//       right: 10,
//     },
//   },

//   legend: {
//     show: false,
//   },

//   tooltip: {
//     theme: "light",
//     x: { show: false },
//   },
// };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
//       <h3 className="text-base font-semibold text-gray-800 mb-4">
//         Project Trends
//       </h3>

//      <Chart
//   options={options}
//   series={data.series}
//   type="area"
//   height={320}
// />

//     </div>
//   );
// };

// export default ProjectTrends;


import Chart from "react-apexcharts";

const ProjectTrends = ({ data }) => {
  const options = {
    chart: {
      type: "area",
      height: 320,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      fontFamily: "Inter, sans-serif",
    },

    colors: ["#22c55e", "#3b82f6"], // green, blue

    stroke: {
      curve: "smooth",
      width: 2.5,
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.8,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },

    dataLabels: {
      enabled: false,
    },

    markers: {
      size: 0,
      hover: { size: 5 },
    },

    xaxis: {
      categories: data.categories, // ["Jan","Feb","Mar","Apr","May","Jun"]
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },

    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
      },
    },

    legend: {
      show: false,
    },

    tooltip: {
      theme: "light",
      x: { show: false },
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Project Trends
      </h3>

      <Chart
        options={options}
        series={data.series}
        type="area"
        height={300}
      />
    </div>
  );
};

export default ProjectTrends;

