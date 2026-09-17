

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ColumnChart = ({ config }) => {
  if (!config) return null; // Prevent rendering if config not ready

  const options = {
    ...config,
    accessibility: { enabled: false },
    credits: { enabled: false }, // removes Highcharts.com watermark
  };

  return (
    <div className="w-full min-h-[400px] bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ColumnChart;
