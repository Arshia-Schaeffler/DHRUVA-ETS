
import React from 'react';
import { useField, useFormikContext } from 'formik';
import Select from 'react-select';

const FormikMultiSelect = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const { setFieldValue } = useFormikContext();

  return (
    <div>
      {label && <label>{label}</label>}
      <Select
        {...props}
        isMulti
        name={field.name}
        value={props.options?.filter(option =>
          field.value?.includes(option.value)
        )}
        onChange={selected => {
          const selectedValues = selected.map(option => option.value);
          setFieldValue(field.name, selectedValues);
        }}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormikMultiSelect;
