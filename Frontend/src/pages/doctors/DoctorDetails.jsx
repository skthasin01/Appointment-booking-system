import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  FaArrowLeft,
  FaBriefcaseMedical,
  FaCalendarCheck,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaStar,
} from 'react-icons/fa';

import { getDoctor } from '../../api/doctors';
import ErrorState from '../../components/common/ErrorState';
import { ProfileSkeleton } from '../../components/common/Skeletons';
import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import useAuth from '../../hooks/useAuth';
import { DAY_ORDER, formatDayOfWeek, formatTimeRange } from '../../utils/formatDate';

const DoctorDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, isPatient } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const loadDoctor = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      setDoctor(await getDoctor(id));
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (notFound || error) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <ErrorState
          error={error}
          context="this doctor profile"
          fallback="We could not load the doctor's details."
          title={notFound ? 'Doctor not found' : undefined}
          description={
            notFound
              ? 'This doctor profile does not exist or was removed. Browse the doctor list to find another specialist.'
              : undefined
          }
          onRetry={notFound ? undefined : loadDoctor}
        >
          <Link to="/doctors" className="btn btn-ghost btn-sm mt-3">
            Browse doctors
          </Link>
        </ErrorState>
      </section>
    );
  }

  const schedules = [...(doctor.schedules || [])]
    .filter((item) => item.is_active)
    .sort(
      (a, b) =>
        DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week) ||
        a.start_time.localeCompare(b.start_time)
    );

  const canBook = doctor.is_available && schedules.length > 0;
  const blockedForRole = isAuthenticated && !isPatient;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <Link
        to="/doctors"
        className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary"
      >
        <FaArrowLeft className="text-xs" />
        All doctors
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-6 p-6 sm:flex-row sm:items-start">
              <DoctorAvatar name={doctor.name} imageUrl={doctor.image_url} size="lg" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                  {doctor.name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.specialty && (
                    <span className="badge badge-soft badge-primary rounded-full">
                      {doctor.specialty}
                    </span>
                  )}
                  <span
                    className={`badge badge-soft rounded-full ${
                      doctor.is_available ? 'badge-success' : 'badge-error'
                    }`}
                  >
                    {doctor.is_available ? 'Accepting patients' : 'Currently unavailable'}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/60">
                  <span className="inline-flex items-center gap-1.5">
                    <FaStar className="text-warning" />
                    <span className="font-medium text-base-content">
                      {Number(doctor.rating ?? 0).toFixed(1)}
                    </span>
                    ({doctor.reviews_count} reviews)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FaBriefcaseMedical className="text-base-content/40" />
                    {doctor.experience_years} years experience
                  </span>
                  {doctor.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-base-content/40" />
                      {doctor.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-3 p-6">
              <h2 className="text-lg font-semibold text-base-content">About</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-base-content/70">
                {doctor.bio || 'No biography has been added yet.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60">
                <span className="inline-flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  {doctor.email}
                </span>
                {doctor.phone && (
                  <span className="inline-flex items-center gap-2">
                    <FaPhoneAlt className="text-primary" />
                    {doctor.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4 p-6">
              <h2 className="text-lg font-semibold text-base-content">Weekly schedule</h2>
              {schedules.length === 0 ? (
                <p className="text-sm text-base-content/60">
                  This doctor has not published any working hours yet.
                </p>
              ) : (
                <ul className="divide-y divide-base-300">
                  {schedules.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                    >
                      <span className="font-medium text-base-content">
                        {formatDayOfWeek(item.day_of_week)}
                      </span>
                      <span className="inline-flex items-center gap-2 text-base-content/70">
                        <FaClock className="text-base-content/40" />
                        {formatTimeRange(item.start_time, item.end_time)}
                        <span className="text-base-content/40">
                          · {item.slot_duration_minutes} min slots
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <aside>
          <div className="card sticky top-24 border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4 p-6">
              <div>
                <p className="text-sm text-base-content/60">Consultation fee</p>
                <p className="text-3xl font-bold text-base-content">
                  ৳{doctor.consultation_fee}
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-base-200 p-4 text-sm">
                <FaShieldAlt className="mt-0.5 text-accent" />
                <span className="text-base-content/70">
                  {doctor.free_cancellation
                    ? 'Free cancellation'
                    : `Cancellation fee: ৳${doctor.cancellation_fee}`}
                </span>
              </div>

              {blockedForRole ? (
                <p className="rounded-xl bg-warning/10 p-4 text-sm text-base-content/70">
                  Only patient accounts can book appointments.
                </p>
              ) : canBook ? (
                <Link to={`/book/${doctor.id}`} className="btn btn-primary w-full">
                  <FaCalendarCheck />
                  Book appointment
                </Link>
              ) : (
                <button type="button" disabled className="btn w-full">
                  Booking unavailable
                </button>
              )}

              {!isAuthenticated && canBook && (
                <p className="text-center text-xs text-base-content/50">
                  You will be asked to sign in before booking.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default DoctorDetails;
