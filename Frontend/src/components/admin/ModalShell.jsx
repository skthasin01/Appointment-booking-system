import { FaTimes } from 'react-icons/fa';

/**
 * Shared dialog frame for the admin screens (same look as the user editor).
 * Render it only while it should be open.
 */
const ModalShell = ({ title, eyebrow, onClose, size = 'lg', children }) => {
  const width = size === 'xl' ? 'max-w-3xl' : size === 'md' ? 'max-w-md' : 'max-w-lg';

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="modal modal-open">
      <div
        className={`modal-box ${width} max-h-[90vh] border border-base-300 bg-base-100 p-0`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-1 truncate text-lg font-semibold text-base-content">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn btn-ghost btn-sm btn-square"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default ModalShell;
