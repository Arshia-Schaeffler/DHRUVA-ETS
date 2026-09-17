

import { useField } from "formik";
import PropTypes from "prop-types";

const DateTimePicker = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col mb-3">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <input
        {...field}
        {...props}
        type="date"
        className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
      />
      {hasError && <span className="text-red-500 text-sm mt-1">{meta.error}</span>}
    </div>
  );
};

DateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default DateTimePicker;

