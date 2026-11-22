import { useState } from 'react';
import toast from 'react-hot-toast';

import { createDoctor } from '../../api/doctors';
import CheckboxField from '../form/CheckboxField';
import PasswordInput from '../form/PasswordInput';
import SubmitButton from '../form/SubmitButton';
import TextArea from '../form/TextArea';
import TextInput from '../form/TextInput';
import { getErrorToast } from '../../utils/getErrorMessage';
import ModalShell from './ModalShell';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  specialty: '',
  location: '',
  bio: '',
  experience_years: 0,
  consultation_fee: 0,
  free_cancellation: true,
  cancellation_fee: 0,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const numeric = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Admin: create a doctor (login account + profile).
 * `onCreated` receives the new doctor from the API.
 */
const AddDoctorModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    else if (form.password.length > 72) next.password = 'Use at most 72 characters';
    if (form.specialty.trim().length < 2) {
      next.specialty = 'Specialty must be at least 2 characters';
    }
    ['experience_years', 'consultation_fee', 'cancellation_fee'].forEach((field) => {
      if (form[field] === '' || numeric(form[field]) < 0) {
        next[field] = 'Enter a number of 0 or more';
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const doctor = await createDoctor({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || null,
        specialty: form.specialty.trim(),
        location: form.location.trim() || null,
        bio: form.bio.trim() || null,
        experience_years: numeric(form.experience_years),
        consultation_fee: numeric(form.consultation_fee),
        free_cancellation: form.free_cancellation,
        cancellation_fee: form.free_cancellation ? 0 : numeric(form.cancellation_fee),
      });
      toast.success(`${doctor.name} added`);
      onCreated(doctor);
    } catch (err) {
      toast.error(getErrorToast(err, 'the new doctor', 'Could not create the doctor.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Add doctor"
      eyebrow="New doctor"
      onClose={saving ? () => {} : onClose}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Full name"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            autoComplete="off"
          />
          <TextInput
            label="Specialty"
            value={form.specialty}
            onChange={handleChange('specialty')}
            error={errors.specialty}
            placeholder="e.g. Cardiology"
          />
          <TextInput
            label="Login email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            autoComplete="off"
          />
          <PasswordInput
            label="Temporary password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            autoComplete="new-password"
          />
          <TextInput
            label="Phone"
            optional
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
          />
          <TextInput
            label="Location"
            optional
            value={form.location}
            onChange={handleChange('location')}
          />
          <TextInput
            label="Experience (years)"
            type="number"
            min="0"
            value={form.experience_years}
            onChange={handleChange('experience_years')}
            error={errors.experience_years}
          />
          <TextInput
            label="Consultation fee (৳)"
            type="number"
            min="0"
            value={form.consultation_fee}
            onChange={handleChange('consultation_fee')}
            error={errors.consultation_fee}
          />
        </div>

        <TextArea
          label="Bio"
          optional
          rows={3}
          value={form.bio}
          onChange={handleChange('bio')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CheckboxField
            label="Free cancellation"
            checked={form.free_cancellation}
            onChange={handleChange('free_cancellation')}
          />
          {!form.free_cancellation && (
            <TextInput
              label="Cancellation fee (৳)"
              type="number"
              min="0"
              value={form.cancellation_fee}
              onChange={handleChange('cancellation_fee')}
              error={errors.cancellation_fee}
            />
          )}
        </div>

        <p className="text-xs text-base-content/50">
          After saving you can add the photo and weekly schedule from the doctor&apos;s
          edit page.
        </p>

        <div className="modal-action mt-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Cancel
          </button>
          <SubmitButton loading={saving}>Add doctor</SubmitButton>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddDoctorModal;
