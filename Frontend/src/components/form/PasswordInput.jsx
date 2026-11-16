import { useId, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import Field from './Field';
import InputIcon from './InputIcon';

const PasswordInput = ({
  label,
  optional,
  error,
  hint,
  icon: Icon,
  revealIcon: RevealIcon = FaEye,
  hideIcon: HideIcon = FaEyeSlash,
  id,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [visible, setVisible] = useState(false);

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
          type={visible ? 'text' : 'password'}
          className={`input w-full bg-base-200 ${Icon ? 'pl-11' : ''} pr-12 ${
            error ? 'input-error' : ''
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-square"
        >
          {visible ? <HideIcon /> : <RevealIcon />}
        </button>
      </span>
    </Field>
  );
};

export default PasswordInput;
