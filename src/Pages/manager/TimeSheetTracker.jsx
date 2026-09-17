
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { PlusCircleIcon, XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

import TimesheetForm from "../../components/common/TimeSheetForm";
import CustomizedCalendar from "../../components/common/CustomizedCalendar";
import FilterableCollapsibleTable from "../../components/HOC/FilterableCollapsibleTable";
import PageTitle from "../../components/common/PageTitle";
import MUIButton from "../../components/common/MUIButton";
import CustomTabs from "../../components/common/CustomTabs";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import {
  CREATE_EMPTIMESHEET,
  GET_TIMESHEETENTRIES_BY_EMP_ID,
  GET_PROJECTS_BY_USER_ID,
  GET_PROJECTS_BY_MANAGER_ID,
  GET_ALL_PROJECTS_DETAILS,
} from "../../utils/Strings";
import { createEventFromTask } from "../../utils/Lib";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import FilterDatePicker from "../../components/common/FilterDatePicker";

//  Validation Schema
const TimesheetSchema = Yup.object().shape({
  workTitle: Yup.string().required("Work title is required"),
  workDescription: Yup.string().required("Work description is required"),
  project: Yup.string().required("Please select a project"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  date: Yup.date().required("Date is required"),
});

const TimeSheetTracker = () => {
  const [open, setOpen] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(0);
  const { auth } = useAuth();

  //  Dynamic API based on role
  const projectAPI =
    auth.role === "Manager"
      ? GET_PROJECTS_BY_MANAGER_ID
      : auth.role === "User"
      ? GET_PROJECTS_BY_USER_ID
      : GET_ALL_PROJECTS_DETAILS;

  const projectResponse = useAxios(projectAPI, {}, true);
  const timesheetEntries = useAxios(GET_TIMESHEETENTRIES_BY_EMP_ID, {}, true, open);
  const createTimesheetEntry = useAxios(CREATE_EMPTIMESHEET, { method: "POST" }, false);

  const filterProjectOptions = (projectResponse?.data ?? []).map((proj) => ({
    label: proj.ProjectName,
    value: proj.ProjectName,
  }));

  const calendarEntries = timesheetEntries.loading
    ? []
    : timesheetEntries.data
        ?.filter((item) => item.ManagerApproval === "Approved")
        ?.map(createEventFromTask);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabChange = (index) => setShowCalendarView(index);

  const tabsData = [
    { label: "OVERVIEW" },
    { label: "CALENDAR" },
  ];

  const columns = [
    { headerName: "Date", field: "WorkDate" },
    { headerName: "Project Name", field: "ProjectName" },
    { headerName: "Title", field: "WorkTitle" },
    { headerName: "Duration (hours)", field: "TotalTimeSpent" },
  ];

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageTitle
          title={
            showCalendarView === 0
              ? "Timesheet Overview"
              : "Timesheet Calendar"
          }
        />

        {/* Tabs and Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 w-full md:w-auto">
          <CustomTabs
            tabs={tabsData}
            value={showCalendarView}
            onChange={handleTabChange}
            tabStyles={{
              default:
                "relative px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200",
              active: "text-green-600 dark:text-green-400 font-semibold",
              hover: "hover:text-green-600 dark:hover:text-green-400",
            }}
            indicatorColor="bg-green-600"
          />

          {showCalendarView === 0 && (
            <div className="flex gap-3 mt-3 md:mt-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <MUIButton
                  onClick={handleOpen}
                  bgColor="bg-green-600"
                  hoverColor="hover:bg-green-700"
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add
                </MUIButton>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <MUIButton
                  onClick={() => {
                    if (!timesheetEntries.loading && timesheetEntries.data?.length > 0) {
                      exportToExcel(timesheetEntries.data, "Timesheet.xlsx");
                      exportToPDF(columns, timesheetEntries.data, "Timesheet.pdf");
                    } else {
                      alert("No timesheet data available to export.");
                    }
                  }}
                  bgColor="bg-blue-600"
                  hoverColor="hover:bg-blue-700"
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download
                </MUIButton>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-6 relative"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Timesheet Form
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <Formik
                initialValues={{
                  workTitle: "",
                  workDescription: "",
                  project: "",
                  startTime: null,
                  endTime: null,
                  date: dayjs(),
                }}
                validationSchema={TimesheetSchema}
                onSubmit={(values) => {
                  const formattedDate = dayjs(values.date).format("YYYY-MM-DD");

                  const convertTo24Hour = (time12h) => {
                    const [time, modifier] = time12h.split(" ");
                    let [hours, minutes] = time.split(":");
                    if (hours === "12") hours = "00";
                    if (modifier === "PM") hours = parseInt(hours, 10) + 12;
                    return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
                  };

                  const start24 = convertTo24Hour(values.startTime);
                  const end24 = convertTo24Hour(values.endTime);

                  const requestObj = {
                    EmpId: auth?.id || auth?.userId,
                    ProjectId: values.project,
                    WorkTitle: values.workTitle,
                    WorkDetails: values.workDescription,
                    WorkDate: formattedDate,
                    TaskStatus: "In Progress",
                    WorkStartTime: `${formattedDate}T${start24}`,
                    WorkEndTime: `${formattedDate}T${end24}`,
                  };

                  createTimesheetEntry.refetch({ data: requestObj });
                  timesheetEntries.refetch();
                  handleClose();
                }}
              >
                {({ values, errors, touched, handleChange, setFieldValue }) => (
                  <Form className="space-y-4">
                    <TimesheetForm
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <MUIButton
                        type="button"
                        onClick={handleClose}
                        bgColor="bg-gray-200"
                        hoverColor="hover:bg-gray-300"
                        className="px-4 py-2 rounded-md"
                      >
                        Cancel
                      </MUIButton>
                      <MUIButton
                        type="submit"
                        bgColor="bg-green-600"
                        hoverColor="hover:bg-green-700"
                        className="px-4 py-2 rounded-md text-white"
                      >
                        Submit
                      </MUIButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table / Calendar View */}
      <motion.div
        key={showCalendarView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {showCalendarView === 0 ? (
          <FilterableCollapsibleTable
            columns={columns}
            data={timesheetEntries.loading ? [] : timesheetEntries.data}
            collapsibleFields={[
              "WorkDetails",
              "TaskStatus",
              "WorkStartTime",
              "WorkEndTime",
            ]}
            keyField={"TimeSheetId"}
            filterFields={["WorkDate", "ProjectName"]}
            filterMeta={{
              ProjectName: { type: "select", options: filterProjectOptions },
              WorkDate: { type: "date" },
            }}
            FormikDateFilter={FilterDatePicker}
            onAddclick={handleOpen}
          />
        ) : (
          <CustomizedCalendar events={calendarEntries} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default TimeSheetTracker;
