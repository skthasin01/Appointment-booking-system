import { useState } from 'react';

import ModalShell from './ModalShell';

/**
 * Yes/No confirmation. `onConfirm` may be async; the dialog closes itself
 * through `onClose` once it resolves, and stays open if it throws.
 */
const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
  onClose,
}) => {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // the caller shows the error toast; keep the dialog open to retry
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title={title} onClose={busy ? () => {} : onClose} size="md">
      <p className="text-sm leading-6 text-base-content/70">{message}</p>
      <div className="modal-action mt-5">
        <button type="button" onClick={onClose} disabled={busy} className="btn btn-ghost">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={busy}
          className={`btn ${danger ? 'btn-error' : 'btn-primary'}`}
        >
          {busy ? <span className="loading loading-spinner loading-sm" /> : confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
};

export default ConfirmDialog;
