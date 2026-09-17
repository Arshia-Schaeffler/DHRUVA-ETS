
import React from "react";
import Select from "react-select";
import { useField, useFormikContext } from "formik";

const Dropdown = ({ name, label, options }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const hasError = meta.touched && meta.error;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'white',
      borderColor: hasError ? '#ef4444' : state.isFocused ? '#16a34a' : '#d1d5db', // red-500 or green-600
      boxShadow: state.isFocused ? '0 0 0 2px rgba(22, 163, 74, 0.5)' : 'none', // green focus ring
      borderRadius: '0.375rem', // rounded-md
      minHeight: '38px',
      padding: '1px',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#bbf7d0', // green-100
      color: '#065f46', // green-800
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#065f46', // green-800
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#065f46',
      ':hover': {
        backgroundColor: '#16a34a', // green-600
        color: 'white',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#16a34a'
        : state.isFocused
        ? '#bbf7d0'
        : 'white',
      color: state.isSelected ? 'white' : '#1f2937', // gray-800
      cursor: 'pointer',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}
      <Select
        id={name}
        inputId={name}
        isMulti
        options={options}
        value={field.value}
        onChange={selected => setFieldValue(name, selected)}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={customStyles}
      />

      {hasError && (
        <div className="text-sm text-red-500 mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default Dropdown;
