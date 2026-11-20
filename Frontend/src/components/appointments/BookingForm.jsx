import { FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';

import SubmitButton from '../form/SubmitButton';
import TextArea from '../form/TextArea';
import { formatDate, formatTimeRange } from '../../utils/formatDate';

const BookingForm = ({ doctor, date, slot, notes, onNotesChange, onSubmit, submitting }) => {
  const ready = Boolean(date && slot);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (ready) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextArea
        label="Notes for the doctor"
        optional
        rows={3}
        maxLength={500}
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Briefly describe your symptoms or reason for visit"
      />

      <ul className="space-y-3 rounded-xl bg-base-200 p-4 text-sm">
        <li className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-base-content/60">
            <FaCalendarAlt className="text-primary" /> Date
          </span>
          <span className="font-medium text-base-content">
            {date ? formatDate(date) : '—'}
          </span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-base-content/60">
            <FaClock className="text-primary" /> Time
          </span>
          <span className="font-medium text-base-content">
            {slot ? formatTimeRange(slot.start_time, slot.end_time) : '—'}
          </span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-base-content/60">
            <FaMoneyBillWave className="text-primary" /> Fee
          </span>
          <span className="font-medium text-base-content">
            ৳{doctor?.consultation_fee ?? 0}
          </span>
        </li>
      </ul>

      <SubmitButton loading={submitting} disabled={!ready || submitting} className="w-full">
        Confirm booking
      </SubmitButton>
      {!ready && (
        <p className="text-center text-xs text-base-content/50">
          Choose a date and time slot to continue.
        </p>
      )}
    </form>
  );
};

export default BookingForm;
