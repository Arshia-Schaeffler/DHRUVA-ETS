import React from "react";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import ProjectSummaryCards from "../../components/manager/ProjectSummaryCards";

import TeamWorkloadSummary from "../../components/manager/TeamWorkloadSummary";
 import AllBudgetUtilizations from "../../components/manager/AllBudgetUtilizations ";
import UpcomingDeadlinesForReport from "../../components/manager/UpcomingDeadlinesForReport";
import PageTitle from "../../components/common/PageTitle";

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.4 } },
};

const ManagerReport = () => {
  const { data: projectSummary = {}, loading: sLoad, error: sErr } = useAxios("/project/get-project-statuswise-counts");
  const { data: deadlines = [], loading: dLoad, error: dErr } = useAxios("/project/get-upcoming-deadlines");
  const { data: workloads = [], loading: wLoad, error: wErr } = useAxios("/employee/team/workload-summary");
  const { data: budgets = [], loading: bLoad, error: bErr } = useAxios("/project/budget/utilization");

  const isLoading = sLoad || dLoad || wLoad || bLoad;
  const isError = sErr || dErr || wErr || bErr;

  if (isLoading) return <p className="text-center text-gray-500 mt-10">Loading report...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">Error loading report data</p>;

  return (
    <motion.div
      className="px-6 py-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
       <PageTitle
      title="Manager Overview Report"
    />

      {/* Summary */}
      <motion.div className="w-full" layout>
        <ProjectSummaryCards summary={projectSummary} />
      </motion.div>

      {/* Upper area: Deadlines */}
      <motion.div layout>
        <UpcomingDeadlinesForReport deadlines={Array.isArray(deadlines) ? deadlines : []} />
      </motion.div>

      {/* Workload & Budget */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" layout>
        <TeamWorkloadSummary data={Array.isArray(workloads) ? workloads : []} />
        <AllBudgetUtilizations data={Array.isArray(budgets) ? budgets : []} />
      </motion.div>
    </motion.div>
  );
};

export default ManagerReport;

