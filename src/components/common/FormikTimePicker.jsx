
import React, { useState, useEffect } from "react";
import { useField } from "formik";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FormikTimePicker = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [timeValue, setTimeValue] = useState(field.value || "");
  const hasError = meta.touched && meta.error;

  useEffect(() => {
    setTimeValue(field.value || "");
  }, [field.value]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center rounded-lg border transition-all duration-200 px-3 py-2 
        ${hasError ? "border-red-400" : "border-gray-300"} 
        bg-white dark:bg-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-green-600`}
      >
        {/* Clock Icon */}
        <ClockIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />

        <Flatpickr
          value={timeValue}
          options={{
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K", // Example: 02:45 PM
            time_24hr: false,
            allowInput: true,
            minuteIncrement: 1,
          }}
          onChange={(selectedDates) => {
            if (selectedDates.length) {
              const date = selectedDates[0];
              const formatted = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              setTimeValue(formatted);
              helpers.setValue(formatted);
            } else {
              setTimeValue("");
              helpers.setValue("");
            }
          }}
          className="w-full bg-transparent text-sm outline-none text-gray-800 dark:text-gray-100 cursor-pointer"
        />

        {/* Clear Button */}
        {timeValue && (
          <button
            type="button"
            onClick={() => {
              setTimeValue("");
              helpers.setValue("");
            }}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear time"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {hasError && <p className="text-xs text-red-500 mt-1">{meta.error}</p>}
    </div>
  );
};

export default FormikTimePicker;
