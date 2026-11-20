import { useState } from 'react';
import { Link } from 'react-router';
import {
  FaCalendarAlt,
  FaClock,
  FaPrescriptionBottle,
  FaStickyNote,
} from 'react-icons/fa';

import DoctorAvatar from '../doctors/DoctorAvatar';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { formatDate, formatTimeRange } from '../../utils/formatDate';

/**
 * `doctor` may be undefined while it is still loading (or if it was deleted).
 * Pass `onCancel` to show a cancel action (with an inline confirmation step).
 */
const AppointmentCard = ({ appointment, doctor, onCancel, cancelling }) => {
  const [confirming, setConfirming] = useState(false);
  const doctorName = doctor?.name || `Doctor #${appointment.doctor_id}`;

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <DoctorAvatar name={doctorName} imageUrl={doctor?.image_url} size="sm" />
            <div className="min-w-0">
              <Link
                to={`/doctors/${appointment.doctor_id}`}
                className="block truncate font-semibold text-base-content hover:text-primary"
              >
                {doctorName}
              </Link>
              <p className="truncate text-xs text-base-content/60">
                {doctor?.specialty || 'Appointment'} · #{appointment.id}
              </p>
            </div>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl bg-base-200 px-4 py-3 text-sm text-base-content/70">
          <span className="inline-flex items-center gap-2">
            <FaCalendarAlt className="text-primary" />
            {formatDate(appointment.appointment_date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <FaClock className="text-primary" />
            {formatTimeRange(appointment.start_time, appointment.end_time)}
          </span>
        </div>

        {(appointment.notes?.trim() || appointment.prescription_notes?.trim()) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {appointment.notes?.trim() && (
              <div className="rounded-xl bg-base-200 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  <FaStickyNote />
                  Your notes
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-base-content/70">
                  {appointment.notes}
                </p>
              </div>
            )}

            {appointment.prescription_notes?.trim() && (
              <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
                  <FaPrescriptionBottle />
                  Prescription
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-base-content/80">
                  {appointment.prescription_notes}
                </p>
              </div>
            )}
          </div>
        )}

        {onCancel && (
          <div className="flex justify-end gap-2 border-t border-base-300 pt-4">
            {confirming ? (
              <>
                <span className="mr-auto self-center text-sm text-base-content/70">
                  Cancel this appointment?
                </span>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={cancelling}
                  className="btn btn-ghost btn-sm"
                >
                  Keep
                </button>
                <button
                  type="button"
                  onClick={() => onCancel(appointment)}
                  disabled={cancelling}
                  className="btn btn-error btn-sm"
                >
                  {cancelling ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    'Yes, cancel'
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="btn btn-ghost btn-sm text-error"
              >
                Cancel appointment
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default AppointmentCard;
