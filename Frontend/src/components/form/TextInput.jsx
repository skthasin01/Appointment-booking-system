import { useId } from 'react';

import Field from './Field';
import InputIcon from './InputIcon';

const TextInput = ({
  label,
  optional,
  error,
  hint,
  icon: Icon,
  trailingIcon: TrailingIcon,
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
      <span className="relative block">
        <InputIcon icon={Icon} />
        <input
          id={inputId}
          className={`input w-full bg-base-200 ${Icon ? 'pl-11' : ''} ${
            TrailingIcon ? 'pr-11' : ''
          } ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        <InputIcon icon={TrailingIcon} position="right" />
      </span>
    </Field>
  );
};

export default TextInput;
