
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

import TimesheetForm from "../../components/common/TimeSheetForm";
import CustomizedCalendar from "../../components/common/CustomizedCalendar";
import FilterableCollapsibleTable from "../../components/HOC/FilterableCollapsibleTable";
import PageTitle from "../../components/common/PageTitle";
import MUIButton from "../../components/common/MUIButton";
import CustomTabs from "../../components/common/CustomTabs";
import useAxios from "../../hooks/useAxios";

import {
  CREATE_EMPTIMESHEET,
  GET_TIMESHEETENTRIES_BY_EMP_ID,
} from "../../utils/Strings";

import { createEventFromTask } from "../../utils/Lib";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import FilterDatePicker from "../../components/common/FilterDatePicker";

// VALIDATION
const TimesheetSchema = Yup.object().shape({
  workTitle: Yup.string().required("Work title is required"),
  workDescription: Yup.string().required("Work description is required"),
  project: Yup.string().required("Please select a project"),
  startTime: Yup.mixed().required("Start time is required"),
  endTime: Yup.mixed().required("End time is required"),
  date: Yup.date().required("Date is required"),
});

const TimeTracking = () => {
  const [open, setOpen] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(0);

  const timesheetEntries = useAxios(
    GET_TIMESHEETENTRIES_BY_EMP_ID,
    {},
    true,
    open
  );

  const createTimesheetEntry = useAxios(
    CREATE_EMPTIMESHEET,
    { method: "POST" },
    false
  );

  // CALENDAR EVENTS
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
    { headerName: "Manager Approval", field: "ManagerApproval" },
    { headerName: "Duration (hours)", field: "TotalTimeSpent" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageTitle
          title={showCalendarView === 0 ? "Timesheet Overview" : "Timesheet Calendar"}
        />

        <div className="flex items-center gap-3">
          {/* Add + Download */}
          {showCalendarView === 0 && (
            <>
              <div className="flex gap-3 mt-3">
                <MUIButton
                  onClick={handleOpen}
                  bgColor="bg-green-600"
                  hoverColor="hover:bg-green-700"
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-md shadow-md"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add
                </MUIButton>

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
                  className="px-4 py-2 rounded-md text-white"
                >
                  Download
                </MUIButton>
              </div>
            </>
          )}

          {/* TABS */}
          <CustomTabs
            tabs={tabsData}
            value={showCalendarView}
            onChange={handleTabChange}
            tabStyles={{
              default:
                "relative px-4 py-3 font-medium text-gray-700 dark:text-gray-200 transition-colors duration-200",
              active: "text-green-700 dark:text-green-400 font-semibold",
              hover: "hover:text-green-700 dark:hover:text-green-400",
            }}
            indicatorColor="bg-green-600"
          />
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Timesheet Form
            </h2>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={handleClose}
            >
              ✕
            </button>

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
                // FORMAT DATE
                const formattedDate = dayjs(values.date).format("YYYY-MM-DD");

                // Convert 12h → 24h
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
              {({
                values,
                errors,
                touched,
                handleChange,
                setFieldValue,
              }) => (
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
          </div>
        </div>
      )}

      {/* TABLE / CALENDAR */}
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
          filterFields={["WorkDate", "ProjectName", "ManagerApproval"]}
          filterMeta={{
            WorkDate: { type: "date" },
            ProjectName: {
              type: "select",
              options: timesheetEntries.data
                ? Array.from(
                    new Map(
                      timesheetEntries.data.map((d) => [
                        d.ProjectName,
                        { label: d.ProjectName, value: d.ProjectName },
                      ])
                    ).values()
                  )
                : [],
            },
            ManagerApproval: {
              type: "select",
              options: [
                { label: "Pending", value: "Pending" },
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
              ],
            },
          }}
          FormikDateFilter={FilterDatePicker}
          onAddclick={handleOpen}
        />
      ) : (
        <CustomizedCalendar events={calendarEntries} />
      )}
    </div>
  );
};

export default TimeTracking;

