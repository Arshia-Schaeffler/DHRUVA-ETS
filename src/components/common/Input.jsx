

import { useField } from "formik";
import PropTypes from "prop-types";

const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <input
        {...field}
        {...props}
        className={`px-3 py-2 rounded-md border text-sm transition focus:outline-none focus:ring-2
          ${
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-green-600"
          }
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        `}
      />

      {hasError && (
        <span className="text-red-500 text-xs mt-1">{meta.error}</span>
      )}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default Input;
