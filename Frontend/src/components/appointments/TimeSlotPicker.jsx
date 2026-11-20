import { FaRegClock } from 'react-icons/fa';

import { formatTime } from '../../utils/formatDate';

const slotKey = (slot) => `${slot.start_time}-${slot.end_time}`;

const TimeSlotPicker = ({ slots, loading, error, selected, onSelect, onRetry }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton h-11 rounded-lg" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-error/10 p-4 text-sm text-error">
        {error}
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-ghost btn-xs ml-2">
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!slots?.length) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-base-200 p-4 text-sm text-base-content/60">
        <FaRegClock />
        No free slots on this day. Please pick another date.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot) => {
        const isSelected = selected && slotKey(selected) === slotKey(slot);
        return (
          <button
            key={slotKey(slot)}
            type="button"
            onClick={() => onSelect(slot)}
            aria-pressed={Boolean(isSelected)}
            className={`btn btn-sm h-11 ${
              isSelected ? 'btn-primary' : 'btn-outline border-base-300 font-medium'
            }`}
          >
            {formatTime(slot.start_time)}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;
