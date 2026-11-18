import { useState } from 'react';

import { getInitials } from '../../data/doctors';

const sizes = {
  sm: 'h-12 w-12 text-sm',
  md: 'h-16 w-16 text-lg',
  lg: 'h-20 w-20 text-xl',
  xl: 'h-28 w-28 text-3xl',
};

const DoctorPhoto = ({ doctor, size = 'md', className = '' }) => {
  const [failed, setFailed] = useState(false);
  const dimension = sizes[size] || sizes.md;

  if (failed || !doctor.photo) {
    return (
      <span
        className={`flex flex-none items-center justify-center rounded-full bg-primary/10 font-bold text-primary ${dimension} ${className}`}
        aria-hidden="true"
      >
        {getInitials(doctor.name)}
      </span>
    );
  }

  return (
    <img
      src={doctor.photo}
      alt={doctor.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`flex-none rounded-full border border-base-300 bg-base-200 object-cover ${dimension} ${className}`}
    />
  );
};

export default DoctorPhoto;
