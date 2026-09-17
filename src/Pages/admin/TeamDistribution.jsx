import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "../../components/common/AxiosInstance";

const TeamDistribution = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamDistribution();
  }, []);

  const fetchTeamDistribution = async () => {
    try {
      const res = await axiosInstance.get(
        "/employee/dashboard/team-distribution"
      );

      const data = res?.data?.data || [];

      setSeries(data.map(item => item.count));
      setLabels(data.map(item => item.team));

    } catch (error) {
      console.error("Team Distribution Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    chart: {
      type: "donut",
    },
    labels,
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      "#22c55e", // Sales - Green
      "#3b82f6", // Project - Blue
      "#f59e0b", // Design - Orange
      "#8b5cf6", // IT - Purple
      "#ef4444", // Other - Red
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 250 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  if (loading) {
    return <div className="text-center py-10">Loading team distribution...</div>;
  }

  if (!series.length) {
    return <div className="text-center py-10 text-gray-500">No data available</div>;
  }

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={300}
    />
  );
};

export default TeamDistribution;
