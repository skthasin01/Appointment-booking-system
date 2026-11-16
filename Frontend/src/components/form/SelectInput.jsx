import { useId } from 'react';

import Field from './Field';

const SelectInput = ({
  label,
  optional,
  error,
  hint,
  id,
  className = '',
  containerClassName = '',
  children,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <Field
      label={label}
      optional={optional}
      error={error}
      hint={hint}
      htmlFor={inputId}
      className={containerClassName}
    >
      <select
        id={inputId}
        className={`select w-full bg-base-200 ${
          error ? 'select-error' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
};

export default SelectInput;
