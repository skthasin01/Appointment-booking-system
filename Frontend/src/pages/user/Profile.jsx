import { useState } from 'react';
import { Link } from 'react-router';
import { FaLock, FaPhoneAlt, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

import ProfileSummary from '../../components/user/ProfileSummary';
import TextInput from '../../components/form/TextInput';
import SubmitButton from '../../components/form/SubmitButton';
import useAuth from '../../hooks/useAuth';
import { getErrorToast } from '../../utils/getErrorMessage';
import { getChangePasswordPath } from '../../utils/profileRoutes';

const Profile = () => {
  const { user, role, updateProfile } = useAuth();
  const [form, setForm] = useState(() => ({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const changePasswordPath = getChangePasswordPath(role);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();

    if (name.length < 2) next.name = 'Name must be at least 2 characters';
    else if (name.length > 100) next.name = 'Use at most 100 characters';
    if (form.phone.length > 20) next.phone = 'Use at most 20 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const updated = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
      });
      setForm({ name: updated.name ?? '', phone: updated.phone ?? '' });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorToast(err, 'your profile', 'Could not update your profile.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
      <div className="grid gap-5 lg:grid-cols-5">
        <ProfileSummary user={user} className="lg:col-span-2" />

        <div className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-3">
          <div className="card-body gap-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold text-base-content">Edit profile</h1>
                <p className="text-sm text-base-content/60">
                  Keep your name and phone number up to date.
                </p>
              </div>
              <Link to={changePasswordPath} className="btn btn-ghost btn-sm">
                <FaLock />
                Change password
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <TextInput
                label="Full name"
                icon={FaUser}
                value={form.name}
                onChange={handleChange('name')}
                autoComplete="name"
                error={errors.name}
              />
              <TextInput
                label="Phone number"
                icon={FaPhoneAlt}
                optional
                value={form.phone}
                onChange={handleChange('phone')}
                autoComplete="tel"
                hint="We'll use this to contact you about appointments."
                error={errors.phone}
              />
              <SubmitButton loading={saving}>Save changes</SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
