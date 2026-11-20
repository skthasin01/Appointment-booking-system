import { FaRegClock } from 'react-icons/fa';

import ErrorState from '../common/ErrorState';
import { Bar, Frame } from '../common/Skeletons';
import { formatTime } from '../../utils/formatDate';

const slotKey = (slot) => `${slot.start_time}-${slot.end_time}`;

const TimeSlotPicker = ({ slots, loading, error, selected, onSelect, onRetry }) => {
  if (loading) {
    return (
      <Frame
        label="Loading time slots"
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Bar key={index} className="h-11 rounded-lg" />
        ))}
      </Frame>
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        context="available time slots"
        fallback="We could not check this doctor's availability."
        onRetry={onRetry}
        compact
      />
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
