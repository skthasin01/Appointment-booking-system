import { useEffect, useState } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { updateDoctor, uploadDoctorImage } from '../../api/doctors';
import CheckboxField from '../form/CheckboxField';
import FileInput from '../form/FileInput';
import SubmitButton from '../form/SubmitButton';
import TextArea from '../form/TextArea';
import TextInput from '../form/TextInput';
import DoctorAvatar from './DoctorAvatar';
import useAuth from '../../hooks/useAuth';
import { getErrorToast } from '../../utils/getErrorMessage';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const buildForm = (doctor) => ({
  name: doctor.name || '',
  phone: doctor.phone || '',
  specialty: doctor.specialty || '',
  bio: doctor.bio || '',
  location: doctor.location || '',
  experience_years: doctor.experience_years ?? 0,
  consultation_fee: doctor.consultation_fee ?? 0,
  cancellation_fee: doctor.cancellation_fee ?? 0,
  free_cancellation: Boolean(doctor.free_cancellation),
  is_available: Boolean(doctor.is_available),
  rating: doctor.rating ?? 5,
  reviews_count: doctor.reviews_count ?? 0,
});

const optionalText = (value) => value.trim() || null;
const numeric = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Shared editor for the admin doctor list and the doctor dashboard.
 * `onSaved` receives the updated doctor from the API.
 */
const DoctorProfileEditor = ({ doctor, onSaved, onClose }) => {
  const { isAdmin, refreshMe } = useAuth();
  const [form, setForm] = useState(() => buildForm(doctor));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (form.specialty.trim().length < 2) {
      next.specialty = 'Specialty must be at least 2 characters';
    }

    ['experience_years', 'consultation_fee', 'cancellation_fee'].forEach((field) => {
      if (form[field] === '' || numeric(form[field]) < 0) {
        next[field] = 'Enter a number of 0 or more';
      }
    });

    if (isAdmin) {
      if (numeric(form.rating) < 0 || numeric(form.rating) > 5) {
        next.rating = 'Rating must be between 0 and 5';
      }
      if (form.reviews_count === '' || numeric(form.reviews_count) < 0) {
        next.reviews_count = 'Enter a number of 0 or more';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      phone: optionalText(form.phone),
      specialty: optionalText(form.specialty),
      bio: optionalText(form.bio),
      location: optionalText(form.location),
      experience_years: numeric(form.experience_years),
      consultation_fee: numeric(form.consultation_fee),
      cancellation_fee: numeric(form.cancellation_fee),
      free_cancellation: form.free_cancellation,
      is_available: form.is_available,
    };

    if (isAdmin) {
      payload.rating = numeric(form.rating);
      payload.reviews_count = numeric(form.reviews_count);
    }

    setSaving(true);
    try {
      const updated = await updateDoctor(doctor.id, payload);
      onSaved?.(updated);
      setForm(buildForm(updated));
      if (
        !isAdmin &&
        (updated.name !== doctor.name || (updated.phone || null) !== (doctor.phone || null))
      ) {
        await refreshMe().catch(() => {});
      }
      toast.success('Doctor profile updated');
    } catch (err) {
      toast.error(
        getErrorToast(err, 'the doctor profile', 'Could not update the doctor profile.')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);
    try {
      const updated = await uploadDoctorImage(doctor.id, image);
      onSaved?.(updated);
      setImage(null);
      setPreview(null);
      setFileKey((prev) => prev + 1);
      toast.success('Profile photo uploaded');
    } catch (err) {
      toast.error(getErrorToast(err, 'the photo upload', 'Could not upload the photo.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <DoctorAvatar name={doctor.name} imageUrl={preview || doctor.image_url} />
            <div>
              <h2 className="text-lg font-semibold text-base-content">
                Edit doctor profile
              </h2>
              <p className="text-sm text-base-content/60">
                Details here appear on the public doctor profile.
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close editor"
              className="btn btn-ghost btn-sm btn-square"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
          <TextInput
            label="Full name"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
          />
          <TextInput
            label="Phone"
            optional
            value={form.phone}
            onChange={handleChange('phone')}
            error={errors.phone}
          />
          <TextInput
            label="Specialty"
            value={form.specialty}
            onChange={handleChange('specialty')}
            error={errors.specialty}
          />
          <TextInput
            label="Location"
            optional
            value={form.location}
            onChange={handleChange('location')}
            error={errors.location}
          />
          <TextInput
            type="number"
            min="0"
            label="Experience (years)"
            value={form.experience_years}
            onChange={handleChange('experience_years')}
            error={errors.experience_years}
          />
          <TextInput
            type="number"
            min="0"
            step="10"
            label="Consultation fee (৳)"
            value={form.consultation_fee}
            onChange={handleChange('consultation_fee')}
            error={errors.consultation_fee}
          />
          <TextInput
            type="number"
            min="0"
            step="10"
            label="Cancellation fee (৳)"
            value={form.cancellation_fee}
            onChange={handleChange('cancellation_fee')}
            error={errors.cancellation_fee}
            disabled={form.free_cancellation}
          />
          {isAdmin && (
            <>
              <TextInput
                type="number"
                min="0"
                max="5"
                step="0.1"
                label="Rating"
                value={form.rating}
                onChange={handleChange('rating')}
                error={errors.rating}
              />
              <TextInput
                type="number"
                min="0"
                label="Review count"
                value={form.reviews_count}
                onChange={handleChange('reviews_count')}
                error={errors.reviews_count}
              />
            </>
          )}
          <TextArea
            label="Bio"
            optional
            rows={3}
            containerClassName="md:col-span-2"
            value={form.bio}
            onChange={handleChange('bio')}
            placeholder="Short introduction shown to patients"
          />

          <div className="flex flex-wrap items-center gap-6 md:col-span-2">
            <CheckboxField
              label="Free cancellation"
              checked={form.free_cancellation}
              onChange={handleChange('free_cancellation')}
            />
            <CheckboxField
              label="Available for bookings"
              checked={form.is_available}
              onChange={handleChange('is_available')}
            />
          </div>

          <div className="md:col-span-2">
            <SubmitButton loading={saving}>Save profile details</SubmitButton>
          </div>
        </form>

        <div className="border-t border-base-300 pt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-base-content">
            <FaCamera />
            Profile photo
          </h3>
          <p className="mt-1 text-xs text-base-content/50">
            JPG, PNG, or WebP up to 5 MB.
          </p>
          <div className="mt-4 flex flex-wrap items-start gap-4">
            <DoctorAvatar
              name={doctor.name}
              imageUrl={preview || doctor.image_url}
              size="lg"
            />
            <div className="min-w-0 flex-1 space-y-3">
              <FileInput
                key={fileKey}
                label="Choose an image"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={handleUpload}
                disabled={!image || uploading}
                className="btn btn-primary btn-sm"
              >
                {uploading && <span className="loading loading-spinner loading-xs" />}
                Upload photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileEditor;
