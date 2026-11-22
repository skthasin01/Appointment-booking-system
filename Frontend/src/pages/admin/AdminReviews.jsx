import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaSearch, FaStar, FaSyncAlt, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { getDoctors } from '../../api/doctors';
import { deleteReview, getAllReviews, updateReview } from '../../api/reviews';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ModalShell from '../../components/admin/ModalShell';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeletons';
import SelectInput from '../../components/form/SelectInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextArea from '../../components/form/TextArea';
import TextInput from '../../components/form/TextInput';
import { formatDate } from '../../utils/formatDate';
import { getErrorToast } from '../../utils/getErrorMessage';

const CRITERIA = [
  { key: 'communication', label: 'Communication' },
  { key: 'behavior', label: 'Behavior' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'treatment_effectiveness', label: 'Treatment' },
];

const Stars = ({ value }) => (
  <span className="inline-flex items-center gap-1">
    <FaStar className="text-warning" />
    {Number(value ?? 0).toFixed(1)}
  </span>
);

const EditReviewDialog = ({ review, onClose, onSaved }) => {
  const [form, setForm] = useState({
    communication: review.communication,
    behavior: review.behavior,
    punctuality: review.punctuality,
    treatment_effectiveness: review.treatment_effectiveness,
    comment: review.comment || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateReview(review.id, {
        communication: Number(form.communication),
        behavior: Number(form.behavior),
        punctuality: Number(form.punctuality),
        treatment_effectiveness: Number(form.treatment_effectiveness),
        comment: form.comment.trim(),
      });
      toast.success('Review updated');
      onSaved(updated);
    } catch (err) {
      toast.error(getErrorToast(err, 'the review', 'Could not update the review.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={`Review #${review.id}`}
      eyebrow={`By ${review.patient?.name || `patient #${review.patient_id}`}`}
      onClose={saving ? () => {} : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {CRITERIA.map(({ key, label }) => (
            <SelectInput
              key={key}
              label={label}
              value={form[key]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [key]: event.target.value }))
              }
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>
                  {score} / 5
                </option>
              ))}
            </SelectInput>
          ))}
        </div>

        <TextArea
          label="Comment"
          optional
          rows={4}
          maxLength={1000}
          value={form.comment}
          onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
        />

        <div className="modal-action mt-2">
          <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost">
            Cancel
          </button>
          <SubmitButton loading={saving}>Save changes</SubmitButton>
        </div>
      </form>
    </ModalShell>
  );
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reviewData, doctorResult] = await Promise.all([
        getAllReviews(),
        getDoctors().catch(() => []), // names are optional — don't fail the page
      ]);
      setReviews(reviewData);
      setDoctors(doctorResult);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const doctorsById = useMemo(
    () => Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor])),
    [doctors]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return reviews;
    return reviews.filter((review) =>
      [
        review.patient?.name,
        doctorsById[review.doctor_id]?.name,
        review.comment,
        `#${review.id}`,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [reviews, search, doctorsById]);

  const handleSaved = (updated) => {
    setReviews((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditing(null);
  };

  const handleDelete = async () => {
    try {
      await deleteReview(removing.id);
      setReviews((prev) => prev.filter((item) => item.id !== removing.id));
      toast.success('Review deleted');
    } catch (err) {
      toast.error(getErrorToast(err, 'the review', 'Could not delete the review.'));
      throw err;
    }
  };

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-base-content">Reviews</h1>
            <p className="text-sm text-base-content/60">
              Edit or remove patient reviews. Doctor ratings update automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <TextInput
          label="Search"
          icon={FaSearch}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Patient, doctor, comment or #id"
          containerClassName="max-w-md"
        />

        {loading ? (
          <TableSkeleton rows={6} columns={6} label="Loading reviews" />
        ) : error ? (
          <ErrorState
            error={error}
            context="reviews"
            fallback="We could not load the reviews."
            onRetry={load}
            compact
          />
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-base-content/60">
            {reviews.length === 0 ? 'No reviews yet.' : 'No reviews match your search.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Patient</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => (
                  <tr key={review.id} className="hover:bg-base-200/60">
                    <td className="font-medium text-base-content">
                      {doctorsById[review.doctor_id]?.name || `Doctor #${review.doctor_id}`}
                    </td>
                    <td>{review.patient?.name || `Patient #${review.patient_id}`}</td>
                    <td className="whitespace-nowrap">
                      <Stars value={review.rating} />
                      <p className="text-xs text-base-content/50">
                        C{review.communication} · B{review.behavior} · P{review.punctuality}{' '}
                        · T{review.treatment_effectiveness}
                      </p>
                    </td>
                    <td className="max-w-xs">
                      <p className="line-clamp-2 text-sm text-base-content/70">
                        {review.comment || '—'}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-sm">
                      {review.created_at ? formatDate(review.created_at.slice(0, 10)) : ''}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(review)}
                          className="btn btn-ghost btn-xs"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoving(review)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditReviewDialog
          review={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
      {removing && (
        <ConfirmDialog
          title="Delete this review?"
          message="The review is removed and the doctor's rating is recalculated. It cannot be undone."
          confirmLabel="Yes, delete"
          danger
          onConfirm={handleDelete}
          onClose={() => setRemoving(null)}
        />
      )}
    </div>
  );
};

export default AdminReviews;
