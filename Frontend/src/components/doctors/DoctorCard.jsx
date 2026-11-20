import { Link } from 'react-router';
import { FaBriefcaseMedical, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

import DoctorAvatar from './DoctorAvatar';

const DoctorCard = ({ doctor }) => {
  const {
    id,
    name,
    specialty,
    location,
    rating,
    reviews_count: reviewsCount,
    consultation_fee: fee,
    experience_years: experience,
    image_url: imageUrl,
    is_available: isAvailable,
  } = doctor;

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200">
      <div className="card-body gap-4 p-5">
        <div className="flex items-start gap-4">
          <DoctorAvatar name={name} imageUrl={imageUrl} />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-base-content">{name}</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {specialty && (
                <span className="badge badge-soft badge-primary rounded-full">
                  {specialty}
                </span>
              )}
              {isAvailable === false && (
                <span className="badge badge-soft badge-error rounded-full">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-base-content/60">
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-base-content/40" />
              {location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <FaStar className="text-warning" />
            <span className="font-medium text-base-content">
              {Number(rating ?? 0).toFixed(1)}
            </span>
            <span className="text-base-content/40">({reviewsCount ?? 0})</span>
          </span>
          {experience > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <FaBriefcaseMedical className="text-base-content/40" />
              {experience} yrs
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-base-300 pt-4">
          <p className="text-sm text-base-content/60">
            Fee <span className="font-semibold text-base-content">৳{fee ?? 0}</span>
          </p>
          <Link to={`/doctors/${id}`} className="btn btn-ghost btn-sm">
            View profile
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DoctorCard;
