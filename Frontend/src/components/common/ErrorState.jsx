import { FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

import { getErrorDetails } from '../../utils/getErrorMessage';

/**
 * User-facing API error with a short title, a concrete explanation, and an
 * optional recovery action. Pass the raw Axios error so status-specific copy
 * (401, 404, 500, network, etc.) is preserved.
 */
const ErrorState = ({
  error,
  context = 'this content',
  fallback,
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  className = '',
  children,
}) => {
  const details = getErrorDetails(error, context, fallback);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`alert rounded-2xl border border-error/20 bg-error/5 text-error shadow-sm ${
        compact ? 'p-4' : 'p-5'
      } ${className}`}
    >
      <span
        className={`flex flex-none items-center justify-center rounded-xl bg-error/10 ${
          compact ? 'h-10 w-10' : 'h-12 w-12'
        }`}
      >
        <FaExclamationTriangle />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
          {title || details.title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-base-content/70">
          {description || details.description}
        </p>
        {children}
      </div>

      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-ghost btn-sm flex-none">
          <FaSyncAlt />
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
