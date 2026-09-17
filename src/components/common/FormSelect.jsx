
import React from "react";
import { useField, useFormikContext } from "formik";
import PropTypes from "prop-types";

const FormSelect = ({ options, name, label, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  const handleChange = (e) => {
    setFieldValue(name, e.target.value);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <select
        {...field}
        {...otherProps}
        id={name}
        onChange={handleChange}
        aria-describedby={hasError ? `${name}-error` : null}
        className={`w-full px-3 py-2 rounded-md border text-sm shadow-sm focus:outline-none focus:ring-2
          ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-green-600"}
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        `}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <div id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {meta.error}
        </div>
      )}
    </div>
  );
};

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FormSelect;

