import { useMemo, useState } from 'react';
import { FaPlus, FaSearch, FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
  BookAppointmentDialog,
  PrescriptionDialog,
  RescheduleDialog,
} from '../../components/admin/AppointmentDialogs';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeletons';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import { STATUS_OPTIONS } from '../../utils/constants';
import SelectInput from '../../components/form/SelectInput';
import TextInput from '../../components/form/TextInput';
import useAdminAppointments from '../../hooks/useAdminAppointments';
import { getErrorToast } from '../../utils/getErrorMessage';

const AdminAppointments = () => {
  const {
    appointments,
    users,
    doctors,
    usersById,
    doctorsById,
    loading,
    error,
    lookupError,
    reload,
    updateStatus,
    upsertAppointment,
  } = useAdminAppointments();

  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  // { type: 'book' | 'reschedule' | 'notes' | 'cancel', item? }
  const [dialog, setDialog] = useState(null);

  const patients = useMemo(
    () => users.filter((user) => user.role === 'patient' && user.is_active),
    [users]
  );

  const closeDialog = () => setDialog(null);

  const handleDone = (updated) => {
    upsertAppointment(updated);
    closeDialog();
  };

  const handleCancel = async () => {
    try {
      await updateStatus(dialog.item.id, 'cancelled');
      toast.success(`Appointment #${dialog.item.id} cancelled`);
    } catch (err) {
      toast.error(getErrorToast(err, 'the appointment', 'Could not cancel it.'));
      throw err;
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return appointments.filter((item) => {
      if (status && item.status !== status) return false;
      if (date && item.appointment_date !== date) return false;
      if (term) {
        const patient = usersById[item.patient_id];
        const doctor = doctorsById[item.doctor_id];
        const haystack = [patient?.name, patient?.email, doctor?.name, `#${item.id}`]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [appointments, status, date, search, usersById, doctorsById]);

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-base-content">Appointments</h1>
            <p className="text-sm text-base-content/60">
              Review every booking and update its status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reload}
              disabled={loading}
              className="btn btn-ghost btn-sm"
            >
              <FaSyncAlt />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setDialog({ type: 'book' })}
              className="btn btn-primary btn-sm"
            >
              <FaPlus />
              Book appointment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextInput
            label="Search"
            icon={FaSearch}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Patient, doctor or #id"
          />
          <SelectInput
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
          <TextInput
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={5} label="Loading appointments" />
        ) : error ? (
          <ErrorState
            error={error}
            context="appointments"
            fallback="We could not load the appointment list."
            onRetry={reload}
            compact
          />
        ) : (
          <>
            {lookupError && (
              <ErrorState
                error={lookupError}
                context="patient and doctor names"
                fallback="Some names may be missing from the table."
                onRetry={reload}
                compact
              />
            )}
            <p className="text-sm text-base-content/60">
              Showing {filtered.length} of {appointments.length}
            </p>
            <AppointmentTable
              appointments={filtered}
              usersById={usersById}
              doctorsById={doctorsById}
              onStatusChange={updateStatus}
              onReschedule={(item) => setDialog({ type: 'reschedule', item })}
              onNotes={(item) => setDialog({ type: 'notes', item })}
              onCancel={(item) => setDialog({ type: 'cancel', item })}
            />
          </>
        )}
      </div>

      {dialog?.type === 'book' && (
        <BookAppointmentDialog
          patients={patients}
          doctors={doctors}
          onClose={closeDialog}
          onDone={() => {
            closeDialog();
            reload();
          }}
        />
      )}
      {dialog?.type === 'reschedule' && (
        <RescheduleDialog
          appointment={dialog.item}
          patient={usersById[dialog.item.patient_id]}
          doctor={doctorsById[dialog.item.doctor_id]}
          onClose={closeDialog}
          onDone={handleDone}
        />
      )}
      {dialog?.type === 'notes' && (
        <PrescriptionDialog
          appointment={dialog.item}
          patient={usersById[dialog.item.patient_id]}
          doctor={doctorsById[dialog.item.doctor_id]}
          onClose={closeDialog}
          onDone={handleDone}
        />
      )}
      {dialog?.type === 'cancel' && (
        <ConfirmDialog
          title={`Cancel appointment #${dialog.item.id}?`}
          message="The patient's slot will be released. This cannot be undone."
          confirmLabel="Yes, cancel it"
          danger
          onConfirm={handleCancel}
          onClose={closeDialog}
        />
      )}
    </div>
  );
};

export default AdminAppointments;
