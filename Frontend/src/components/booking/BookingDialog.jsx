import { useEffect, useState } from 'react';
import {
  FaCalendarCheck,
  FaClock,
  FaShieldAlt,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { formatDate, formatFee, formatTime } from '../../data/doctors';
import useAuth from '../../hooks/useAuth';
import SelectInput from '../form/SelectInput';
import SubmitButton from '../form/SubmitButton';
import TextArea from '../form/TextArea';
import TextInput from '../form/TextInput';
import DoctorPhoto from '../doctor/DoctorPhoto';

const BookingDialog = ({ doctor, initialDate, initialTime, onClose }) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date: initialDate || doctor.availableDates[0] || '',
    time: initialTime || doctor.availableTimes[0] || '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = 'Patient name is required';
    }
    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address';
    }
    if (!form.date) {
      next.date = 'Choose a date';
    }
    if (!form.time) {
      next.time = 'Choose a time';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      toast.success(
        `Appointment requested with ${doctor.name} on ${formatDate(form.date)} at ${formatTime(form.time)}`
      );
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Book an appointment with ${doctor.name}`}
      className="modal modal-open"
    >
      <div className="modal-box max-w-lg border border-base-300 bg-base-100 p-0">
        <div className="flex items-start gap-4 border-b border-base-300 p-5">
          <DoctorPhoto doctor={doctor} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Book appointment
            </p>
            <p className="truncate font-semibold text-base-content">
              {doctor.name}
            </p>
            <p className="truncate text-xs text-base-content/60">
              {doctor.specialty} · {doctor.area}, {doctor.city}
            </p>
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

        <form onSubmit={handleSubmit} className="space-y-4 p-5" noValidate>
          <div className="flex items-center gap-2 rounded-xl bg-base-200 px-4 py-3 text-sm text-base-content/70">
            <FaUser className="text-primary" />
            Confirm your details so the clinic can reach you.
          </div>

          <TextInput
            label="Patient name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Your full name"
            autoComplete="name"
            error={errors.name}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
            />

            <TextInput
              label="Phone"
              optional
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+880 1700-000000"
              autoComplete="tel"
              error={errors.phone}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectInput
              label="Date"
              value={form.date}
              onChange={handleChange('date')}
              error={errors.date}
            >
              {doctor.availableDates.map((value) => (
                <option key={value} value={value}>
                  {formatDate(value)}
                </option>
              ))}
            </SelectInput>

            <SelectInput
              label="Time"
              value={form.time}
              onChange={handleChange('time')}
              error={errors.time}
            >
              {doctor.availableTimes.map((value) => (
                <option key={value} value={value}>
                  {formatTime(value)}
                </option>
              ))}
            </SelectInput>
          </div>

          <TextArea
            label="Notes"
            optional
            value={form.notes}
            onChange={handleChange('notes')}
            rows={3}
            placeholder="Anything the doctor should know"
          />

          <div className="rounded-xl bg-base-200 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Visit cost</span>
              <span className="font-semibold text-base-content">
                {formatFee(doctor.visitCost)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base-content/70">Selected slot</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-base-content">
                <FaCalendarCheck className="text-primary" />
                {form.date ? formatDate(form.date) : '—'}
                <FaClock className="ml-1 text-primary" />
                {form.time ? formatTime(form.time) : '—'}
              </span>
            </div>
            <div className="mt-3 flex items-start gap-2 border-t border-base-300 pt-3 text-xs text-base-content/60">
              <FaShieldAlt className="mt-0.5 flex-none text-primary" />
              {doctor.cancellation
                ? `Free cancellation up to ${doctor.cancellationHours} hours before the appointment.`
                : 'This doctor does not accept cancellations once booked.'}
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <SubmitButton loading={submitting}>Confirm booking</SubmitButton>
          </div>
        </form>
      </div>

      <button
        type="button"
        aria-label="Close booking dialog"
        onClick={onClose}
        className="modal-backdrop"
      />
    </div>
  );
};

export default BookingDialog;
