// import React from "react";
// import Chart from "react-apexcharts";

// const ProjectHoursBarChart = ({ data }) => {
//   const labels = data.map((p) => p.name);
//   // const values = data.map((p) => Number(p.hours.toFixed(2)));
//   const values = data.map((p) => Number((p.hours ?? 0).toFixed(2)));


//   const options = {
//     chart: {
//       type: "bar",
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         borderRadius: 6,
//       },
//     },
//     xaxis: {
//       categories: labels,
//       title: { text: "Hours" },
//     },
//     tooltip: {
//       y: {
//         formatter: (val) => `${val} hrs`,
//       },
//     },
//     colors: ["#3b82f6"],
//   };

//   const series = [
//     {
//       name: "Hours",
//       data: values,
    

//     },
//   ];
//     console.log("Chart Data:", data);

//   return (
//     <div className="bg-white p-4 rounded-xl shadow">
//       <h2 className="text-lg font-semibold mb-3">
//         Project Contribution (Hours)
//       </h2>
      
//       <Chart options={options} series={series} type="bar" height={330} />
//     </div>
//   );
// };

// export default ProjectHoursBarChart;
