// Specialties offered in the doctor filter (merged with those returned by the API)
export const DEFAULT_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dentistry',
  'Eye Care',
  'General Medicine',
  'Family Medicine',
];

// Backend AppointmentStatus values
export const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed', badge: 'badge-info' },
  { value: 'checked_in', label: 'Checked in', badge: 'badge-secondary' },
  { value: 'in_consultation', label: 'In consultation', badge: 'badge-warning' },
  { value: 'completed', label: 'Completed', badge: 'badge-success' },
  { value: 'cancelled', label: 'Cancelled', badge: 'badge-error' },
];
