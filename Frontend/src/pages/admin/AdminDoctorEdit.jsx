import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

import { getDoctor } from '../../api/doctors';
import ErrorState from '../../components/common/ErrorState';
import { FormSkeleton } from '../../components/common/Skeletons';
import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import DoctorProfileEditor from '../../components/doctors/DoctorProfileEditor';
import DoctorScheduleEditor from '../../components/admin/DoctorScheduleEditor';

const AdminDoctorEdit = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loadedFor, setLoadedFor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadedFor === doctorId) return undefined;

    let active = true;
    getDoctor(doctorId)
      .then((profile) => {
        if (active) {
          setDoctor(profile);
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
          setLoadedFor(doctorId);
        }
      });

    return () => {
      active = false;
    };
  }, [doctorId, loadedFor]);

  const loading = loadedFor !== doctorId;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/doctors" className="btn btn-ghost btn-sm gap-2">
            <FaArrowLeft />
            Back to doctors
          </Link>
          <h1 className="mt-3 text-xl font-bold text-base-content">Edit doctor</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Update profile details and the public photo for this doctor.
          </p>
        </div>
        {doctor && (
          <button
            type="button"
            onClick={() => setLoadedFor(null)}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            <FaSyncAlt />
            Reload
          </button>
        )}
      </div>

      {loading ? (
        <FormSkeleton />
      ) : error || !doctor ? (
        <ErrorState
          error={error}
          context="this doctor"
          fallback="We could not load the doctor profile."
          title={error ? undefined : 'Doctor not found'}
          description={
            error
              ? undefined
              : 'This doctor may have been removed. Return to the doctor list and choose another profile.'
          }
          onRetry={error ? () => setLoadedFor(null) : undefined}
        >
          <Link to="/admin/doctors" className="btn btn-ghost btn-sm mt-3">
            Back to doctors
          </Link>
        </ErrorState>
      ) : (
        <>
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <DoctorAvatar
                  name={doctor.name}
                  imageUrl={doctor.image_url}
                  size="lg"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Editing doctor #{doctor.id}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-base-content">
                    {doctor.name}
                  </p>
                  <p className="text-sm text-base-content/60">{doctor.email}</p>
                </div>
              </div>
              <Link
                to={`/doctors/${doctor.id}`}
                className="btn btn-ghost btn-sm"
              >
                View public profile
              </Link>
            </div>
          </div>

          <DoctorProfileEditor doctor={doctor} onSaved={setDoctor} />
          <DoctorScheduleEditor doctorId={doctor.id} doctorName={doctor.name} />
        </>
      )}
    </div>
  );
};

export default AdminDoctorEdit;
