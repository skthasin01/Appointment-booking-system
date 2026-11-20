import { addDaysISO, parseISODate } from '../../utils/formatDate';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Shows the next `days` days as selectable chips.
 * Days the doctor does not work (per `workingDays`) are disabled.
 */
const DatePicker = ({ value, onChange, workingDays = [], days = 14 }) => {
  const dates = Array.from({ length: days }, (_, index) => {
    const iso = addDaysISO(index);
    const date = parseISODate(iso);
    const dayKey = DAY_KEYS[date.getDay()];
    return {
      iso,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isWorkingDay: workingDays.length === 0 || workingDays.includes(dayKey),
      isToday: index === 0,
    };
  });

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((item) => {
          const selected = item.iso === value;
          return (
            <button
              key={item.iso}
              type="button"
              disabled={!item.isWorkingDay}
              onClick={() => onChange(item.iso)}
              aria-pressed={selected}
              aria-label={`${item.weekday} ${item.month} ${item.day}${
                item.isWorkingDay ? '' : ' (not available)'
              }`}
              className={`flex w-16 flex-none flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors ${
                selected
                  ? 'border-primary bg-primary text-primary-content'
                  : item.isWorkingDay
                    ? 'border-base-300 bg-base-100 text-base-content hover:border-primary hover:text-primary'
                    : 'cursor-not-allowed border-base-300 bg-base-200 text-base-content/30'
              }`}
            >
              <span className="text-xs font-medium uppercase">
                {item.isToday ? 'Today' : item.weekday}
              </span>
              <span className="mt-1 text-xl font-bold">{item.day}</span>
              <span className="text-xs">{item.month}</span>
            </button>
          );
        })}
      </div>
      {workingDays.length > 0 && (
        <p className="mt-1 text-xs text-base-content/50">
          Greyed-out days are outside the doctor&apos;s working hours.
        </p>
      )}
    </div>
  );
};

export default DatePicker;
