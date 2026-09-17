import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "../../components/common/AxiosInstance";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const MonthlyOverviewChart = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyOverview();
  }, []);

  const fetchMonthlyOverview = async () => {
    try {
      const res = await axiosInstance.get(
        "/empTimesheet/dashboard/monthly-overview"
      );

      const data = res?.data?.data || [];

      const worked = MONTHS.map(
        m => data.find(d => d.month === m)?.worked || 0
      );
      const billable = MONTHS.map(
        m => data.find(d => d.month === m)?.billable || 0
      );

      setSeries([
        { name: "Worked Hours", data: worked },
        { name: "Billable Hours", data: billable },
      ]);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#22c55e", "#3b82f6"],
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: MONTHS },
    yaxis: { title: { text: "Hours" } },
    legend: { position: "top" },
  };

  if (loading) return <div>Loading chart...</div>;

  return (
    <Chart options={options} series={series} type="bar" height={300} />
  );
};

export default MonthlyOverviewChart;
