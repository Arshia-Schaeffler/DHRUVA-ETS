import { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";

const ProgressRow = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-500">{value}%</span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const TeamPerformance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  axiosInstance
    .get("/employee/team-performance")
    .then(res => setData(res.data.data)) 
    .catch(err => console.error(err));
}, []);


  const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Team Performance
      </h3>

      {data.map((item, i) => (
        <ProgressRow
          key={item.team}
          label={item.team}
          value={item.percentage}
          color={colors[i % colors.length]}
        />
      ))}
    </div>
  );
};

export default TeamPerformance;
