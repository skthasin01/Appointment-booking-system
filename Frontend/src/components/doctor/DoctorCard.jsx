import { FaCalendarAlt, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { Link } from 'react-router';

import { formatDate, formatFee } from '../../data/doctors';
import BookNowButton from '../booking/BookNowButton';
import DoctorPhoto from './DoctorPhoto';

const DoctorCard = ({ doctor }) => {
  const nextDate = doctor.availableDates[0];

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200">
      <div className="card-body gap-4 p-5">
        <div className="flex items-start gap-4">
          <DoctorPhoto doctor={doctor} size="md" />

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-base-content">
              {doctor.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-base-content/60">
              {doctor.specialty}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/60">
              <span className="inline-flex items-center gap-1">
                <FaStar className="text-warning" />
                <span className="font-medium text-base-content">
                  {doctor.rating}
                </span>
                <span className="text-base-content/40">
                  ({doctor.ratingCount})
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <FaMapMarkerAlt className="text-base-content/40" />
                {doctor.area}, {doctor.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
          <span className="badge badge-soft badge-primary rounded-full">
            {doctor.experienceYears} yrs exp
          </span>
          {doctor.cancellation ? (
            <span className="badge badge-soft badge-success rounded-full">
              Free cancellation
            </span>
          ) : (
            <span className="badge badge-soft rounded-full">
              No cancellation
            </span>
          )}
        </div>

        <div className="mt-1 space-y-3 border-t border-base-300 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-sm text-base-content/60">
              Visit cost{' '}
              <span className="font-semibold text-base-content">
                {formatFee(doctor.visitCost)}
              </span>
            </p>
            {nextDate && (
              <p className="inline-flex items-center gap-1 text-xs text-base-content/50">
                <FaCalendarAlt />
                Next: {formatDate(nextDate)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/doctors/${doctor.id}`}
              className="btn btn-ghost btn-sm min-w-0 flex-1"
            >
              View profile
            </Link>
            <BookNowButton
              doctor={doctor}
              className="btn btn-primary btn-sm min-w-0 flex-1"
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default DoctorCard;
