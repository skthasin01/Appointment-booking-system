import { useState } from 'react';
import toast from 'react-hot-toast';

import AppointmentStatusBadge from './AppointmentStatusBadge';
import { STATUS_OPTIONS } from '../../utils/constants';
import { formatDate, formatTimeRange } from '../../utils/formatDate';
import { getErrorToast } from '../../utils/getErrorMessage';

/**
 * Admin table of appointments. Pass `onStatusChange(id, status)` to make the
 * status editable; otherwise a read-only badge is shown.
 */
const AppointmentTable = ({
  appointments,
  usersById,
  doctorsById,
  onStatusChange,
  onReschedule,
  onNotes,
  onCancel,
}) => {
  const [savingId, setSavingId] = useState(null);
  const hasActions = Boolean(onReschedule || onNotes || onCancel);

  const handleChange = async (appointment, status) => {
    if (status === appointment.status) return;
    setSavingId(appointment.id);
    try {
      await onStatusChange(appointment.id, status);
      toast.success(`Appointment #${appointment.id} updated`);
    } catch (err) {
      toast.error(getErrorToast(err, 'the appointment status', 'Could not update the status.'));
    } finally {
      setSavingId(null);
    }
  };

  if (!appointments.length) {
    return (
      <p className="py-10 text-center text-sm text-base-content/60">
        No appointments to show.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date &amp; time</th>
            <th>Status</th>
            {hasActions && <th />}
          </tr>
        </thead>
        <tbody>
          {appointments.map((item) => {
            const patient = usersById[item.patient_id];
            const doctor = doctorsById[item.doctor_id];
            return (
              <tr key={item.id} className="hover:bg-base-200/60">
                <td className="text-base-content/50">{item.id}</td>
                <td>
                  <p className="font-medium text-base-content">
                    {patient?.name || `Patient #${item.patient_id}`}
                  </p>
                  {patient?.email && (
                    <p className="text-xs text-base-content/50">{patient.email}</p>
                  )}
                </td>
                <td>
                  <p className="font-medium text-base-content">
                    {doctor?.name || `Doctor #${item.doctor_id}`}
                  </p>
                  {doctor?.specialty && (
                    <p className="text-xs text-base-content/50">{doctor.specialty}</p>
                  )}
                </td>
                <td className="whitespace-nowrap">
                  <p>{formatDate(item.appointment_date)}</p>
                  <p className="text-xs text-base-content/50">
                    {formatTimeRange(item.start_time, item.end_time)}
                  </p>
                </td>
                <td>
                  {onStatusChange ? (
                    <select
                      aria-label={`Status for appointment ${item.id}`}
                      value={item.status}
                      disabled={savingId === item.id}
                      onChange={(event) => handleChange(item, event.target.value)}
                      className="select select-sm w-40 bg-base-200"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <AppointmentStatusBadge status={item.status} />
                  )}
                </td>
                {hasActions && (
                  <td>
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      {onNotes && (
                        <button
                          type="button"
                          onClick={() => onNotes(item)}
                          className="btn btn-ghost btn-xs"
                        >
                          Notes
                        </button>
                      )}
                      {onReschedule && item.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => onReschedule(item)}
                          className="btn btn-ghost btn-xs"
                        >
                          Reschedule
                        </button>
                      )}
                      {onCancel &&
                        item.status !== 'cancelled' &&
                        item.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => onCancel(item)}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
