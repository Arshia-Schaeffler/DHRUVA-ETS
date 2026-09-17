import React from "react";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";

const MultiSelect = ({ name, label, options, placeholder }) => {
  const { values, errors, touched, setFieldValue, handleBlur } = useFormikContext();

  const handleChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setFieldValue(name, selectedOptions);
  };

  const isError = touched[name] && errors[name];

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        multiple
        name={name}
        id={name}
        onBlur={handleBlur}
        value={Array.isArray(values[name]) ? values[name] : []}
        onChange={handleChange}
        className={`h-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          isError
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        } dark:bg-gray-700 dark:text-white`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            ✅ {option.label}
          </option>
        ))}
      </select>

      {isError && <div className="text-red-500 text-sm mt-1">{errors[name]}</div>}
    </div>
  );
};

MultiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
};

export default MultiSelect;
