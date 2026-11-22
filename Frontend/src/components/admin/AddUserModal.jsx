import { useState } from 'react';
import toast from 'react-hot-toast';

import { createUser } from '../../api/auth';
import PasswordInput from '../form/PasswordInput';
import SelectInput from '../form/SelectInput';
import SubmitButton from '../form/SubmitButton';
import TextInput from '../form/TextInput';
import { getErrorToast } from '../../utils/getErrorMessage';
import ModalShell from './ModalShell';

// Doctors are created from the Doctors page (they also need a profile)
const ROLE_OPTIONS = [
  { value: 'patient', label: 'Patient' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'admin', label: 'Admin' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = { name: '', email: '', phone: '', password: '', role: 'patient' };

/** Admin: create a patient / receptionist / admin account. */
const AddUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    else if (form.password.length > 72) next.password = 'Use at most 72 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const user = await createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || null,
        role: form.role,
      });
      toast.success(`${user.name} added`);
      onCreated(user);
    } catch (err) {
      toast.error(getErrorToast(err, 'the new user', 'Could not create the user.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Add user" eyebrow="New account" onClose={saving ? () => {} : onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextInput
          label="Name"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="off"
        />
        <TextInput
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="off"
        />
        <TextInput
          label="Phone"
          optional
          type="tel"
          value={form.phone}
          onChange={handleChange('phone')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            label="Temporary password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            autoComplete="new-password"
          />
          <SelectInput label="Role" value={form.role} onChange={handleChange('role')}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </div>

        <div className="modal-action mt-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Cancel
          </button>
          <SubmitButton loading={saving}>Add user</SubmitButton>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddUserModal;
