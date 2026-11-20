const Loading = ({ label, className = 'min-h-[60vh]' }) => (
  <div
    role="status"
    className={`flex flex-col items-center justify-center gap-3 ${className}`}
  >
    <span className="loading loading-spinner loading-lg text-primary" />
    {label && <p className="text-sm text-base-content/60">{label}</p>}
  </div>
);

export default Loading;
