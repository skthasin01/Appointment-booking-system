import { Link } from 'react-router';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const ProviderCard = ({ provider }) => {
  const { id, name, specialty, location, rating, reviews, fee, initials } =
    provider;

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200">
      <div className="card-body gap-4 p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {initials}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-base-content">{name}</h3>
            <span className="badge badge-soft badge-primary mt-2 rounded-full">
              {specialty}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-base-content/60">
          <span className="inline-flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-base-content/40" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaStar className="text-warning" />
            <span className="font-medium text-base-content">{rating}</span>
            <span className="text-base-content/40">({reviews})</span>
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-base-300 pt-4">
          <p className="text-sm text-base-content/60">
            From <span className="font-semibold text-base-content">৳{fee}</span>
          </p>
          <Link to={`/providers/${id}`} className="btn btn-ghost btn-sm">
            View profile
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProviderCard;
