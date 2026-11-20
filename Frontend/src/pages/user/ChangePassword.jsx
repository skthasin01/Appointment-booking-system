import { useState } from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { changePassword } from '../../api/auth';
import ProfileSummary from '../../components/user/ProfileSummary';
import PasswordInput from '../../components/form/PasswordInput';
import SubmitButton from '../../components/form/SubmitButton';
import useAuth from '../../hooks/useAuth';
import { getErrorToast } from '../../utils/getErrorMessage';
import { getProfilePath } from '../../utils/profileRoutes';

const emptyForm = { current: '', next: '', confirm: '' };

const ChangePassword = () => {
  const { user, role } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const profilePath = getProfilePath(role);

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
      toast.error(getErrorToast(err, 'your password', 'Could not update your password.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="grid gap-5 lg:grid-cols-5">
        <ProfileSummary user={user} className="lg:col-span-2" />

        <div className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-3">
          <div className="card-body gap-5 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Account security
              </p>
              <h1 className="mt-2 text-xl font-bold text-base-content">
                Change password
              </h1>
              <p className="mt-1 text-sm text-base-content/60">
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
              <div className="flex flex-wrap items-center gap-3">
                <SubmitButton loading={submitting}>Update password</SubmitButton>
                <Link to={profilePath} className="btn btn-ghost">
                  Back to profile
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
