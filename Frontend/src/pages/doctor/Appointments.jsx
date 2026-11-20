import { useMemo, useState } from 'react';
import { FaEdit, FaSyncAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeletons';
import SelectInput from '../../components/form/SelectInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextArea from '../../components/form/TextArea';
import useDoctorDashboard from '../../hooks/useDoctorDashboard';
import { STATUS_OPTIONS } from '../../utils/constants';
import { formatDate, formatTimeRange } from '../../utils/formatDate';
import { getErrorToast } from '../../utils/getErrorMessage';

const TABS = [
  { value: 'all', label: 'All' },
  ...STATUS_OPTIONS,
];

const Appointments = () => {
  const { appointments, loading, error, reload, updateStatus } =
    useDoctorDashboard();
  const [tab, setTab] = useState('all');
  const [savingId, setSavingId] = useState(null);
  const [prescriptionFor, setPrescriptionFor] = useState(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const visible = useMemo(
    () =>
      tab === 'all'
        ? appointments
        : appointments.filter((item) => item.status === tab),
    [appointments, tab]
  );

  const handleStatusChange = async (appointment, status) => {
    if (status === appointment.status) return;
    setSavingId(appointment.id);
    try {
      await updateStatus(appointment.id, status);
      toast.success(`Appointment #${appointment.id} updated`);
    } catch (err) {
      toast.error(getErrorToast(err, 'the appointment status', 'Could not update the status.'));
    } finally {
      setSavingId(null);
    }
  };

  const openPrescription = (appointment) => {
    setPrescriptionFor(appointment);
    setNotes(appointment.prescription_notes || '');
  };

  const closePrescription = () => {
    setPrescriptionFor(null);
    setNotes('');
  };

  const handleSavePrescription = async (event) => {
    event.preventDefault();
    setSavingNotes(true);
    try {
      await updateStatus(
        prescriptionFor.id,
        prescriptionFor.status,
        notes.trim() || null
      );
      toast.success('Prescription saved');
      closePrescription();
    } catch (err) {
      toast.error(getErrorToast(err, 'the prescription', 'Could not save the prescription.'));
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-base-content">Appointments</h1>
            <p className="text-sm text-base-content/60">
              Review bookings and update their status.
            </p>
          </div>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div role="tablist" className="tabs tabs-bordered overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={tab === item.value}
              onClick={() => setTab(item.value)}
              className={`tab whitespace-nowrap ${tab === item.value ? 'tab-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <TableSkeleton rows={5} columns={5} label="Loading appointments" />
        ) : error ? (
          <ErrorState
            error={error}
            context="your appointments"
            fallback="We could not load the appointment list."
            onRetry={reload}
            compact
          />
        ) : visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-base-content/60">
            No appointments in this view.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date &amp; time</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Prescription</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className="hover:bg-base-200/60">
                    <td>
                      <p className="font-medium text-base-content">
                        {item.patient?.name || `Patient #${item.patient_id}`}
                      </p>
                      {item.patient?.phone && (
                        <p className="text-xs text-base-content/50">
                          {item.patient.phone}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      <p>{formatDate(item.appointment_date)}</p>
                      <p className="text-xs text-base-content/50">
                        {formatTimeRange(item.start_time, item.end_time)}
                      </p>
                    </td>
                    <td className="max-w-xs text-sm text-base-content/60">
                      <span className="line-clamp-1">{item.notes || '—'}</span>
                    </td>
                    <td>
                      <SelectInput
                        aria-label={`Status for appointment ${item.id}`}
                        value={item.status}
                        disabled={savingId === item.id}
                        onChange={(event) =>
                          handleStatusChange(item, event.target.value)
                        }
                        containerClassName="w-40"
                        className="select-sm"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectInput>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {item.prescription_notes && (
                          <span className="badge badge-soft badge-success rounded-full">
                            Saved
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => openPrescription(item)}
                          className="btn btn-ghost btn-xs"
                        >
                          <FaEdit />
                          {item.prescription_notes ? 'Edit' : 'Add'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {prescriptionFor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Prescription for appointment ${prescriptionFor.id}`}
          className="modal modal-open"
        >
          <div className="modal-box max-w-lg border border-base-300 bg-base-100 p-0">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Appointment #{prescriptionFor.id}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-base-content">
                  Prescription notes
                </h2>
              </div>
              <button
                type="button"
                onClick={closePrescription}
                aria-label="Close"
                className="btn btn-ghost btn-sm btn-square"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4 p-5">
              <p className="text-sm text-base-content/60">
                For {prescriptionFor.patient?.name || `patient #${prescriptionFor.patient_id}`}{' '}
                on {formatDate(prescriptionFor.appointment_date)}.
              </p>
              <TextArea
                label="Notes"
                optional
                rows={5}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Diagnosis, advice, medication..."
              />
              <div className="modal-action mt-2">
                <button type="button" onClick={closePrescription} className="btn btn-ghost">
                  Cancel
                </button>
                <SubmitButton loading={savingNotes}>Save</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
