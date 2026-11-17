import { useState } from 'react';
import { FaCalendarPlus, FaLock, FaSignInAlt, FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';

import useAuth from '../../hooks/useAuth';
import BookingDialog from './BookingDialog';

const LoginPromptDialog = ({ doctor, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      className="modal modal-open"
    >
      <div className="modal-box max-w-md border border-base-300 bg-base-100 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn btn-ghost btn-sm btn-square absolute right-3 top-3"
        >
          <FaTimes />
        </button>

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-xl text-warning">
          <FaLock />
        </span>

        <h2
          id="login-prompt-title"
          className="mt-5 text-xl font-bold text-base-content"
        >
          Sign in to book
        </h2>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          You need an account to book {doctor.name}. Sign in and we will bring
          you right back to this appointment.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              navigate('/login', {
                state: { from: location.pathname },
              })
            }
            className="btn btn-primary w-full"
          >
            <FaSignInAlt />
            Sign in
          </button>
          <button
            type="button"
            onClick={() => navigate('/register', { state: { from: location.pathname } })}
            className="btn btn-ghost w-full"
          >
            <FaCalendarPlus />
            Create an account
          </button>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
            Not now
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close sign in prompt"
        onClick={onClose}
        className="modal-backdrop"
      />
    </div>
  );
};

const BookNowButton = ({
  doctor,
  label = 'Book now',
  className = 'btn btn-primary btn-sm',
  initialDate,
  initialTime,
}) => {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState(null);

  const close = () => setMode(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setMode(isAuthenticated ? 'book' : 'login')}
        className={className}
      >
        <FaCalendarPlus />
        {label}
      </button>

      {mode === 'login' && (
        <LoginPromptDialog doctor={doctor} onClose={close} />
      )}

      {mode === 'book' && (
        <BookingDialog
          doctor={doctor}
          initialDate={initialDate}
          initialTime={initialTime}
          onClose={close}
        />
      )}
    </>
  );
};

export default BookNowButton;
