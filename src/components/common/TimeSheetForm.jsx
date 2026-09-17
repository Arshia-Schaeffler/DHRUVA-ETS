
import React, { useState } from "react";
import dayjs from "dayjs";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Input from "./Input";
import FormSelect from "./FormSelect";
import FormikTimePicker from "./FormikTimePicker";
import FilterDatePicker from "./FormikDatePicker";

import {
  GET_PROJECTS_BY_USER_ID,
  GET_PROJECTS_BY_MANAGER_ID,
  GET_ALL_PROJECTS_DETAILS,
} from "../../utils/Strings";

const TimesheetForm = ({ values, setFieldValue }) => {
  const { auth } = useAuth();

  // Select correct project API by role
  const API =
    auth.role === "Manager"
      ? GET_PROJECTS_BY_MANAGER_ID
      : auth.role === "User"
      ? GET_PROJECTS_BY_USER_ID
      : GET_ALL_PROJECTS_DETAILS;

  const projects = useAxios(API, {}, true);

  const [disablePast, setDisablePast] = useState(true);

  // Handle time change
  const handleTimeChange = (name, newValue) => {
    const formatted = newValue ? dayjs(newValue).format("HH:mm:ss") : "";
    setFieldValue(name, formatted);
  };

  // Handle date change
  const handleDateChange = (name, newValue) => {
    const formatted = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
    setFieldValue(name, formatted);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Work Title */}
      <div className="col-span-1 md:col-span-2">
        <Input name="workTitle" label="Work Title" />
      </div>

      {/* Work Description */}
      <div className="col-span-1 md:col-span-2">
        <Input name="workDescription" label="Work Description" />
      </div>

      {/* Project Select */}
      <div className="col-span-1 md:col-span-2">
        <FormSelect
          name="project"
          label="Select Project"
          options={(projects?.data ?? []).map(({ ProjectId, ProjectName }) => ({
            value: ProjectId,
            label: ProjectName,
          }))}
        />
      </div>

      {/* Start Time */}
      <div>
        <FormikTimePicker
          name="startTime"
          label="Start Time"
          value={values.startTime ? dayjs(`1970-01-01T${values.startTime}`) : null}
          onChange={(name, newValue) => handleTimeChange(name, newValue)}
        />
      </div>

      {/* End Time */}
      <div>
        <FormikTimePicker
          name="endTime"
          label="End Time"
          value={values.endTime ? dayjs(`1970-01-01T${values.endTime}`) : null}
          onChange={(name, newValue) => handleTimeChange(name, newValue)}
        />
      </div>

      {/* Date Picker */}
      <div className="col-span-1 md:col-span-2">
        <FilterDatePicker
  name="date"
  label="Select Date"
  value={values.date ? new Date(values.date) : new Date()}
  onChange={(newValue) => handleDateChange("date", newValue)}  // ✅ FIXED
  disableFuture={false}
  disablePast={disablePast}
/>

      </div>

      {/* Allow Past Dates Toggle */}
      <div className="col-span-1 md:col-span-2 flex items-center gap-3 mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!disablePast}
            onChange={() => setDisablePast(!disablePast)}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Allow Past Dates
          </span>
        </label>
      </div>
    </div>
  );
};

export default TimesheetForm;
