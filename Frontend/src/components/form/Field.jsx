const Field = ({
  label,
  optional,
  error,
  hint,
  htmlFor,
  className = '',
  children,
}) => (
  <div className={className}>
    {label && (
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-base-content/80"
      >
        {label}
        {optional && <span className="text-base-content/40"> (optional)</span>}
      </label>
    )}

    {children}

    {error ? (
      <span className="mt-1 block text-xs text-error">{error}</span>
    ) : (
      hint && (
        <span className="mt-1 block text-xs text-base-content/50">{hint}</span>
      )
    )}
  </div>
);

export default Field;
