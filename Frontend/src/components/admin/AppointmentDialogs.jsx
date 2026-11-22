import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import {
  bookAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
} from '../../api/appointments';
import { getAvailableSlots } from '../../api/schedules';
import DatePicker from '../appointments/DatePicker';
import TimeSlotPicker from '../appointments/TimeSlotPicker';
import SelectInput from '../form/SelectInput';
import SubmitButton from '../form/SubmitButton';
import TextArea from '../form/TextArea';
import { formatDate, formatTimeRange } from '../../utils/formatDate';
import { getErrorToast } from '../../utils/getErrorMessage';
import ModalShell from './ModalShell';

const workingDaysOf = (doctor) =>
  (doctor?.schedules || [])
    .filter((item) => item.is_active)
    .map((item) => item.day_of_week);

/** Loads the free slots of one doctor on one day. */
const useSlots = (doctorId, date) => {
  const [state, setState] = useState({ slots: [], loading: false, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!doctorId || !date) return undefined;

    let active = true;
    setState({ slots: [], loading: true, error: null });
    getAvailableSlots(doctorId, date)
      .then((slots) => {
        if (active) setState({ slots, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ slots: [], loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [doctorId, date, attempt]);

  const ready = Boolean(doctorId && date);
  return {
    slots: ready ? state.slots : [],
    loading: ready && state.loading,
    error: ready ? state.error : null,
    retry: () => setAttempt((value) => value + 1),
  };
};

const Summary = ({ rows }) => (
  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl bg-base-200 p-4 text-sm">
    {rows.map(([label, value]) => (
      <div key={label} className="contents">
        <dt className="text-base-content/50">{label}</dt>
        <dd className="font-medium text-base-content">{value}</dd>
      </div>
    ))}
  </dl>
);

/** Move a confirmed appointment to another date / free slot. */
export const RescheduleDialog = ({ appointment, patient, doctor, onClose, onDone }) => {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(null);
  const [saving, setSaving] = useState(false);
  const { slots, loading, error, retry } = useSlots(appointment.doctor_id, date);

  const handleDate = (value) => {
    setDate(value);
    setSlot(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!date || !slot) return;

    setSaving(true);
    try {
      const updated = await rescheduleAppointment(appointment.id, {
        appointment_date: date,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });
      toast.success(`Appointment #${appointment.id} rescheduled`);
      onDone(updated);
    } catch (err) {
      toast.error(getErrorToast(err, 'the appointment', 'Could not reschedule it.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={`Reschedule #${appointment.id}`}
      eyebrow="Appointment"
      onClose={saving ? () => {} : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Summary
          rows={[
            ['Patient', patient?.name || `Patient #${appointment.patient_id}`],
            ['Doctor', doctor?.name || `Doctor #${appointment.doctor_id}`],
            [
              'Current',
              `${formatDate(appointment.appointment_date)}, ${formatTimeRange(
                appointment.start_time,
                appointment.end_time
              )}`,
            ],
          ]}
        />

        <div>
          <p className="mb-1.5 text-sm font-medium text-base-content/80">New date</p>
          <DatePicker
            value={date}
            onChange={handleDate}
            workingDays={workingDaysOf(doctor)}
          />
        </div>

        {date && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-base-content/80">New time</p>
            <TimeSlotPicker
              slots={slots}
              loading={loading}
              error={error}
              selected={slot}
              onSelect={setSlot}
              onRetry={retry}
            />
          </div>
        )}

        <div className="modal-action mt-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Cancel
          </button>
          <SubmitButton loading={saving} disabled={!date || !slot || saving}>
            Reschedule
          </SubmitButton>
        </div>
      </form>
    </ModalShell>
  );
};

/** View the patient's note and write / edit the prescription notes. */
export const PrescriptionDialog = ({ appointment, patient, doctor, onClose, onDone }) => {
  const [notes, setNotes] = useState(appointment.prescription_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      // The status endpoint also stores the notes; keep the status as it is.
      const updated = await updateAppointmentStatus(
        appointment.id,
        appointment.status,
        notes.trim()
      );
      toast.success('Notes saved');
      onDone(updated);
    } catch (err) {
      toast.error(getErrorToast(err, 'the notes', 'Could not save the notes.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={`Notes for #${appointment.id}`}
      eyebrow="Appointment"
      onClose={saving ? () => {} : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Summary
          rows={[
            ['Patient', patient?.name || `Patient #${appointment.patient_id}`],
            ['Doctor', doctor?.name || `Doctor #${appointment.doctor_id}`],
            [
              'When',
              `${formatDate(appointment.appointment_date)}, ${formatTimeRange(
                appointment.start_time,
                appointment.end_time
              )}`,
            ],
            ['Patient note', appointment.notes || 'None'],
          ]}
        />

        <TextArea
          label="Prescription / consultation notes"
          rows={6}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Diagnosis, medicines, follow-up advice…"
        />

        <div className="modal-action mt-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Cancel
          </button>
          <SubmitButton loading={saving}>Save notes</SubmitButton>
        </div>
      </form>
    </ModalShell>
  );
};

/** Admin books an appointment on behalf of a patient. */
export const BookAppointmentDialog = ({ patients, doctors, onClose, onDone }) => {
  const bookableDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.is_available),
    [doctors]
  );
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const doctor = bookableDoctors.find((item) => String(item.id) === doctorId);
  const { slots, loading, error, retry } = useSlots(doctor?.id, date);

  const handleDoctor = (event) => {
    setDoctorId(event.target.value);
    setDate('');
    setSlot(null);
  };

  const handleDate = (value) => {
    setDate(value);
    setSlot(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!patientId || !doctor || !date || !slot) return;

    setSaving(true);
    try {
      const created = await bookAppointment({
        patient_id: Number(patientId),
        doctor_id: doctor.id,
        appointment_date: date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        notes: notes.trim() || null,
      });
      toast.success('Appointment booked');
      onDone(created);
    } catch (err) {
      toast.error(getErrorToast(err, 'the booking', 'Could not book the appointment.'));
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = patientId && doctor && date && slot && !saving;

  return (
    <ModalShell
      title="Book an appointment"
      eyebrow="On behalf of a patient"
      onClose={saving ? () => {} : onClose}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectInput
            label="Patient"
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
            hint={patients.length === 0 ? 'No active patients found' : undefined}
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.email})
              </option>
            ))}
          </SelectInput>

          <SelectInput label="Doctor" value={doctorId} onChange={handleDoctor}>
            <option value="">Select a doctor</option>
            {bookableDoctors.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.specialty ? ` — ${item.specialty}` : ''}
              </option>
            ))}
          </SelectInput>
        </div>

        {doctor && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-base-content/80">Date</p>
            <DatePicker
              value={date}
              onChange={handleDate}
              workingDays={workingDaysOf(doctor)}
            />
          </div>
        )}

        {doctor && date && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-base-content/80">Time</p>
            <TimeSlotPicker
              slots={slots}
              loading={loading}
              error={error}
              selected={slot}
              onSelect={setSlot}
              onRetry={retry}
            />
          </div>
        )}

        <TextArea
          label="Note"
          optional
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Reason for the visit"
        />

        <div className="modal-action mt-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Cancel
          </button>
          <SubmitButton loading={saving} disabled={!canSubmit}>
            Book appointment
          </SubmitButton>
        </div>
      </form>
    </ModalShell>
  );
};
