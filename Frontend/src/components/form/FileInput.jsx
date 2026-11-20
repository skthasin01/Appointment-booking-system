import { useId } from 'react';

import Field from './Field';

const FileInput = ({
  label,
  optional,
  error,
  hint,
  id,
  className = '',
  containerClassName = '',
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
      <input
        id={inputId}
        type="file"
        className={`file-input w-full bg-base-200 ${error ? 'file-input-error' : ''} ${className}`}
        {...props}
      />
    </Field>
  );
};

export default FileInput;
