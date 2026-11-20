import { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaSyncAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { adminUpdateUser, getUsers } from '../../api/auth';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeletons';
import CheckboxField from '../../components/form/CheckboxField';
import SelectInput from '../../components/form/SelectInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextInput from '../../components/form/TextInput';
import useAuth from '../../hooks/useAuth';
import { getErrorToast } from '../../utils/getErrorMessage';

const ROLE_OPTIONS = [
  { value: 'patient', label: 'Patient' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'admin', label: 'Admin' },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  role: 'patient',
  is_active: true,
};

const AdminUsers = () => {
  const { user: currentUser, refreshMe } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setUsers(await getUsers());
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getUsers()
      .then((data) => {
        if (active) {
          setUsers(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    load();
  };

  const isSelf = editing?.id === currentUser?.id;

  const openEditor = (user) => {
    setEditing(user);
    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      role: user.role ?? 'patient',
      is_active: Boolean(user.is_active),
    });
    setErrors({});
  };

  const closeEditor = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    const email = form.email.trim();

    if (name.length < 2) next.name = 'Name must be at least 2 characters';
    else if (name.length > 100) next.name = 'Name must be at most 100 characters';

    if (!email) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address';

    if (form.phone.length > 20) next.phone = 'Phone must be at most 20 characters';
    if (!ROLE_OPTIONS.some((option) => option.value === form.role)) {
      next.role = 'Choose a valid role';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const updated = await adminUpdateUser(editing.id, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        role: form.role,
        is_active: form.is_active,
      });
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (isSelf) await refreshMe();
      toast.success('User updated');
      closeEditor();
    } catch (err) {
      toast.error(getErrorToast(err, 'the user account', 'Could not update user.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-base-content">Users</h1>
            <p className="text-sm text-base-content/60">
              Manage account details, roles, and access.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={5} label="Loading users" />
        ) : error ? (
          <ErrorState
            error={error}
            context="users"
            fallback="We could not load the user list."
            onRetry={handleRefresh}
            compact
          />
        ) : users.length === 0 ? (
          <p className="py-10 text-center text-sm text-base-content/60">
            No users have been registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200/60">
                    <td>
                      <div className="font-medium text-base-content">{user.name}</div>
                      <div className="text-xs text-base-content/50">{user.email}</div>
                    </td>
                    <td>{user.phone || '—'}</td>
                    <td className="capitalize">{user.role}</td>
                    <td>
                      <span
                        className={`badge badge-soft rounded-full ${
                          user.is_active ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => openEditor(user)}
                        className="btn btn-ghost btn-xs"
                      >
                        <FaEdit />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editing.name}`}
          className="modal modal-open"
        >
          <div className="modal-box max-w-lg border border-base-300 bg-base-100 p-0">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Manage user
                </p>
                <h2 className="mt-1 text-lg font-semibold text-base-content">
                  {editing.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close"
                className="btn btn-ghost btn-sm btn-square"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5" noValidate>
              <TextInput
                label="Name"
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                autoComplete="name"
                error={errors.name}
              />
              <TextInput
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                autoComplete="email"
                error={errors.email}
              />
              <TextInput
                label="Phone"
                optional
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                autoComplete="tel"
                error={errors.phone}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectInput
                  label="Role"
                  value={form.role}
                  onChange={handleChange('role')}
                  disabled={isSelf}
                  hint={isSelf ? 'You cannot change your own role' : undefined}
                  error={errors.role}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>

                <div className="flex flex-col justify-center gap-2">
                  <CheckboxField
                    label="Active account"
                    checked={form.is_active}
                    onChange={handleChange('is_active')}
                    disabled={isSelf}
                  />
                  {isSelf && (
                    <p className="text-xs text-base-content/50">
                      You cannot deactivate yourself
                    </p>
                  )}
                </div>
              </div>

              <div className="modal-action mt-2">
                <button type="button" onClick={closeEditor} className="btn btn-ghost">
                  Cancel
                </button>
                <SubmitButton loading={saving}>Save changes</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
