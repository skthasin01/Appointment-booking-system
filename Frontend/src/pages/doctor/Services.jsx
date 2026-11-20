import { FaMapMarkerAlt, FaStar, FaUserMd } from 'react-icons/fa';

import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import DoctorProfileEditor from '../../components/doctors/DoctorProfileEditor';
import ErrorState from '../../components/common/ErrorState';
import { ProfileSkeleton } from '../../components/common/Skeletons';
import useDoctorProfile from '../../hooks/useDoctorProfile';

const Services = () => {
  const { doctor, setDoctor, loading, error } = useDoctorProfile();

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !doctor) {
    return (
      <ErrorState
        error={error || 'Doctor profile not found.'}
        context="your practice details"
        fallback="We could not load your doctor profile."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <DoctorAvatar
              name={doctor.name}
              imageUrl={doctor.image_url}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <FaUserMd className="text-primary" />
                <h1 className="text-lg font-semibold text-base-content">
                  My Practice
                </h1>
              </div>
              <p className="mt-1 text-sm text-base-content/60">{doctor.name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                <span className="inline-flex items-center gap-2">
                  <FaStar className="text-warning" />
                  {Number(doctor.rating ?? 0).toFixed(1)} ({doctor.reviews_count ?? 0}{' '}
                  reviews)
                </span>
                {doctor.location && (
                  <span className="inline-flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {doctor.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span
            className={`badge badge-soft rounded-full ${
              doctor.is_available ? 'badge-success' : 'badge-error'
            }`}
          >
            {doctor.is_available ? 'Accepting bookings' : 'Bookings paused'}
          </span>
        </div>
      </div>

      <DoctorProfileEditor doctor={doctor} onSaved={setDoctor} />
    </div>
  );
};

export default Services;
