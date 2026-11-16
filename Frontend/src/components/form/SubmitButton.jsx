const SubmitButton = ({ loading, children, className = '', ...props }) => (
  <button
    type="submit"
    disabled={loading}
    className={`btn btn-primary ${className}`}
    {...props}
  >
    {loading ? <span className="loading loading-spinner loading-sm" /> : children}
  </button>
);

export default SubmitButton;
