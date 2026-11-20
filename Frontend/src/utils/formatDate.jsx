const pad = (value) => String(value).padStart(2, '0');

// Date -> "YYYY-MM-DD" using local time (the format the API expects)
export const toISODate = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = () => toISODate(new Date());

export const addDaysISO = (days, from = new Date()) => {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  return toISODate(next);
};

// "YYYY-MM-DD" -> Date at local midnight (avoids UTC off-by-one)
export const parseISODate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// "2026-11-20" -> "Fri, Nov 20, 2026"
export const formatDate = (value, options) => {
  const date = value instanceof Date ? value : parseISODate(value);
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(
    'en-US',
    options || { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );
};

// "14:30:00" -> "2:30 PM"
export const formatTime = (value) => {
  if (!value) return '';
  const [hours, minutes] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${pad(minutes)} ${suffix}`;
};

export const formatTimeRange = (start, end) =>
  end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);

// True if the appointment's date + start time is in the past
export const isPastAppointment = (appointmentDate, startTime) => {
  const date = parseISODate(appointmentDate);
  if (!date) return false;
  const [hours = 0, minutes = 0] = (startTime || '').split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime() < Date.now();
};

const DAY_LABELS = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const DAY_ORDER = Object.keys(DAY_LABELS);

export const formatDayOfWeek = (day) => DAY_LABELS[day] || day;
