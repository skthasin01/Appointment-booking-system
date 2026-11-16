const CheckboxField = ({ label, error, className = "", ...props }) => (
  <div>
    <label className="flex items-center gap-3">
      <input type="checkbox" className={`checkbox ${className}`} {...props} />
      <span className="text-sm text-base-content/70">{label}</span>
    </label>
    {error && <span className="mt-1 block text-xs text-error">{error}</span>}
  </div>
);

export default CheckboxField;
