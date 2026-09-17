
import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";
import { useFormikContext, useField } from "formik";

const FilterDatePicker = ({
  name,
  label,
  placeholder = "Select date",
  disablePast = false,
  disableFuture = false,
  value: propValue,
  onChange: propOnChange,
}) => {
  let formikContext;
  try {
    formikContext = useFormikContext();
  } catch {
    formikContext = null;
  }

  const isFormik = !!formikContext;
  const [field] = isFormik ? useField(name) : [{}];
  const setFieldValue = isFormik ? formikContext.setFieldValue : null;

  // local selected date for input control
  const [selectedDate, setSelectedDate] = useState(
    propValue ? new Date(propValue) : field?.value ? new Date(field.value) : null
  );

  useEffect(() => {
    if (propValue) {
      setSelectedDate(new Date(propValue));
    } else if (isFormik && field?.value) {
      const v = field.value;
      setSelectedDate(v ? new Date(v) : null);
    } else {
      setSelectedDate(null);
    }
  }, [propValue, field?.value, isFormik]);

  const handleChange = (date) => {
    setSelectedDate(date);
    const formatted = date ? date.toISOString().split("T")[0] : "";
    if (isFormik) {
      setFieldValue(name, formatted);
    } else if (propOnChange) {
      propOnChange(name, formatted);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    if (isFormik) {
      setFieldValue(name, "");
    } else if (propOnChange) {
      propOnChange(name, "");
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={`${name}-datepicker`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      {/* calendar icon - vertically centered */}
      <div
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-20 text-[#006D3C] dark:text-green-400 cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          document.querySelector(`#${name}-datepicker`)?.focus();
        }}
      >
        <CalendarIcon className="w-5 h-5" />
      </div>

      <ReactDatePicker
        id={`${name}-datepicker`}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        portalId="root"
        minDate={disablePast ? new Date() : null}
        maxDate={disableFuture ? new Date() : null}
        className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-300 
          focus:ring-2 focus:ring-[#006D3C] focus:outline-none 
          bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 
          text-sm transition-all placeholder-gray-400"
        calendarClassName="rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800"
      />

      {/* clear button - vertically centered and inside input */}
      {selectedDate && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none z-20"
          aria-label="Clear date"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FilterDatePicker;
