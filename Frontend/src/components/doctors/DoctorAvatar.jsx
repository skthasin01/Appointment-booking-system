import { useState } from 'react';

import client from '../../api/client';

const getInitials = (name = '') =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DR';

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${client.defaults.baseURL?.replace(/\/$/, '')}${imageUrl}`;
};

const sizes = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-24 w-24 text-3xl',
};

/** Doctor photo with an initials fallback (used when there is no image or it fails to load). */
const DoctorAvatar = ({ name, imageUrl, size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  const src = resolveImageUrl(imageUrl);
  const sizeClass = sizes[size] || sizes.md;

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${sizeClass} flex-none rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} flex flex-none items-center justify-center rounded-full bg-primary/10 font-bold text-primary`}
    >
      {getInitials(name)}
    </span>
  );
};

export default DoctorAvatar;
