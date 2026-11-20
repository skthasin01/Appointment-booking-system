import { useState } from 'react';
import { FaEnvelope, FaLock, FaPhoneAlt, FaUserTag } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { changePassword } from '../../api/auth';
import PasswordInput from '../../components/form/PasswordInput';
import SubmitButton from '../../components/form/SubmitButton';
import useAuth from '../../hooks/useAuth';
import getErrorMessage from '../../utils/getErrorMessage';

const emptyForm = { current: '', next: '', confirm: '' };

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.current) next.current = 'Current password is required';
    if (form.next.length < 6) next.next = 'Use at least 6 characters';
    else if (form.next.length > 72) next.next = 'Use at most 72 characters';
    else if (form.next === form.current) next.next = 'New password must be different';
    if (form.confirm !== form.next) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await changePassword(form.current, form.next);
      toast.success('Password updated');
      setForm(emptyForm);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update your password.'));
    } finally {
      setSubmitting(false);
    }
  };

  const details = [
    { icon: FaEnvelope, label: 'Email', value: user?.email },
    { icon: FaPhoneAlt, label: 'Phone', value: user?.phone || 'Not provided' },
    { icon: FaUserTag, label: 'Account type', value: user?.role },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-2">
          <div className="card-body items-center gap-4 p-6 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </span>
            <div>
              <h1 className="text-xl font-bold text-base-content">{user?.name}</h1>
              <span
                className={`badge badge-soft mt-2 rounded-full ${
                  user?.is_active ? 'badge-success' : 'badge-error'
                }`}
              >
                {user?.is_active ? 'Active account' : 'Inactive account'}
              </span>
            </div>

            <ul className="w-full space-y-3 border-t border-base-300 pt-4 text-left text-sm">
              {details.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-base-200 text-primary">
                    <item.icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-base-content/50">{item.label}</p>
                    <p className="truncate font-medium capitalize text-base-content">
                      {item.label === 'Email' ? (
                        <span className="normal-case">{item.value}</span>
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-3">
          <div className="card-body gap-4 p-6">
            <div>
              <h2 className="text-lg font-semibold text-base-content">Change password</h2>
              <p className="text-sm text-base-content/60">
                Choose a strong password you don&apos;t use anywhere else.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <PasswordInput
                label="Current password"
                icon={FaLock}
                value={form.current}
                onChange={handleChange('current')}
                autoComplete="current-password"
                error={errors.current}
              />
              <PasswordInput
                label="New password"
                icon={FaLock}
                value={form.next}
                onChange={handleChange('next')}
                autoComplete="new-password"
                hint="6–72 characters"
                error={errors.next}
              />
              <PasswordInput
                label="Confirm new password"
                icon={FaLock}
                value={form.confirm}
                onChange={handleChange('confirm')}
                autoComplete="new-password"
                error={errors.confirm}
              />
              <SubmitButton loading={submitting}>Update password</SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
