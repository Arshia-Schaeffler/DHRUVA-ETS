import React from "react";
import { useField, useFormikContext } from "formik";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";

const FormikDatePicker = ({ label, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const handleChange = (date) => {
    setFieldValue(field.name, date ? date.toISOString().split("T")[0] : "");
  };

  const clearDate = () => {
    setFieldValue(field.name, "");
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative w-full group">
        <ReactDatePicker
          id={field.name}
          selected={field.value ? new Date(field.value) : null}
          onChange={handleChange}
          dateFormat="dd/MM/yyyy"
          placeholderText={props.placeholder || "Select date"}
          name={field.name}
          className={`w-full h-11 px-3 pl-11 pr-10 rounded-lg border text-sm
            border-gray-300/80 bg-white/90 text-gray-800 shadow-sm
            focus:border-[#006D3C] focus:ring-2 focus:ring-[#006D3C]/40
            dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
            dark:focus:ring-[#22C55E]/50 transition-all duration-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            ${meta.touched && meta.error ? "border-red-500 focus:ring-red-300" : ""}
          `}
          popperClassName="z-[9999]"
          calendarClassName="z-[9999]"
        />

        {/* Calendar Icon */}
        <CalendarIcon
          className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-[#006D3C] transition-colors duration-200 pointer-events-none"
        />

        {/* Clear Button */}
        {field.value && (
          <button
            type="button"
            onClick={clearDate}
            className="absolute right-2.5 top-2.5 p-1.5 rounded-md 
                       text-gray-400 hover:text-gray-700 hover:bg-gray-100
                       dark:hover:bg-gray-800 dark:hover:text-gray-200 
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#006D3C]/40"
            aria-label="Clear date"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {meta.touched && meta.error && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikDatePicker;
