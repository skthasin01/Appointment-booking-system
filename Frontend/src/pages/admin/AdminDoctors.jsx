import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { deleteDoctor, getDoctors } from '../../api/doctors';
import AddDoctorModal from '../../components/admin/AddDoctorModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/Skeletons';
import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import { getErrorToast } from '../../utils/getErrorMessage';

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDoctors(await getDoctors());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreated = (doctor) => {
    setAdding(false);
    // Continue on the edit page to add the photo and weekly schedule
    navigate(`/admin/doctors/${doctor.id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteDoctor(removing.id);
      setDoctors((prev) => prev.filter((item) => item.id !== removing.id));
      toast.success(`${removing.name} deleted`);
    } catch (err) {
      toast.error(getErrorToast(err, 'the doctor', 'Could not delete the doctor.'));
      throw err;
    }
  };

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-base-content">Doctors</h1>
            <p className="text-sm text-base-content/60">
              Add, edit, schedule or remove doctors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="btn btn-ghost btn-sm"
            >
              <FaSyncAlt />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="btn btn-primary btn-sm"
            >
              <FaPlus />
              Add doctor
            </button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={7} label="Loading doctors" />
        ) : error ? (
          <ErrorState
            error={error}
            context="doctors"
            fallback="We could not load the doctor list."
            onRetry={load}
            compact
          />
        ) : doctors.length === 0 ? (
          <p className="py-10 text-center text-sm text-base-content/60">
            No doctors have been added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Location</th>
                  <th>Fee</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-base-200/60">
                    <td>
                      <div className="flex items-center gap-3">
                        <DoctorAvatar
                          name={doctor.name}
                          imageUrl={doctor.image_url}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-base-content">
                            {doctor.name}
                          </p>
                          <p className="text-xs text-base-content/50">
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{doctor.specialty || '—'}</td>
                    <td>{doctor.location || '—'}</td>
                    <td>৳{doctor.consultation_fee}</td>
                    <td>
                      <span className="inline-flex items-center gap-1">
                        <FaStar className="text-warning" />
                        {Number(doctor.rating ?? 0).toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-soft rounded-full ${
                          doctor.is_available ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {doctor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/doctors/${doctor.id}`}
                          className="btn btn-ghost btn-xs"
                        >
                          <FaEdit />
                          Edit
                        </Link>
                        <Link
                          to={`/doctors/${doctor.id}`}
                          className="btn btn-ghost btn-xs"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setRemoving(doctor)}
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

      {adding && (
        <AddDoctorModal onClose={() => setAdding(false)} onCreated={handleCreated} />
      )}
      {removing && (
        <ConfirmDialog
          title={`Delete ${removing.name}?`}
          message="This removes the doctor's profile, login account and all of their appointments. It cannot be undone."
          confirmLabel="Yes, delete"
          danger
          onConfirm={handleDelete}
          onClose={() => setRemoving(null)}
        />
      )}
    </div>
  );
};

export default AdminDoctors;
