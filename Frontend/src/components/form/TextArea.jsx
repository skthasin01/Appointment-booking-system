import { useId } from 'react';

import Field from './Field';

const TextArea = ({
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
      <textarea
        id={inputId}
        className={`textarea w-full bg-base-200 ${
          error ? 'textarea-error' : ''
        } ${className}`}
        {...props}
      />
    </Field>
  );
};

export default TextArea;
