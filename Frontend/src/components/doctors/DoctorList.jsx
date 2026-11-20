import { FaUserMd } from 'react-icons/fa';

import ErrorState from '../common/ErrorState';
import { DoctorGridSkeleton } from '../common/Skeletons';
import DoctorCard from './DoctorCard';

const DoctorList = ({ doctors, loading, error, onRetry, emptyMessage }) => {
  if (loading) {
    return <DoctorGridSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        context="doctors"
        fallback="We could not load the doctor list right now."
        onRetry={onRetry}
      />
    );
  }

  if (!doctors?.length) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-xl text-base-content/40">
          <FaUserMd />
        </span>
        <p className="text-sm text-base-content/60">
          {emptyMessage || 'No doctors match your search.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
