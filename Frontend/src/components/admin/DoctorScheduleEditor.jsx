import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { getDoctorSchedule, replaceDoctorSchedule } from '../../api/schedules';
import ErrorState from '../common/ErrorState';
import { ScheduleSkeleton } from '../common/Skeletons';
import CheckboxField from '../form/CheckboxField';
import SelectInput from '../form/SelectInput';
import SubmitButton from '../form/SubmitButton';
import TextInput from '../form/TextInput';
import { DAY_ORDER, formatDayOfWeek } from '../../utils/formatDate';
import { getErrorToast } from '../../utils/getErrorMessage';

const DURATIONS = [10, 15, 20, 30, 45, 60];

const buildRows = (schedules = []) =>
  DAY_ORDER.map((day) => {
    const found = schedules.find((item) => item.day_of_week === day);
    return {
      day_of_week: day,
      start_time: found ? found.start_time.slice(0, 5) : '09:00',
      end_time: found ? found.end_time.slice(0, 5) : '17:00',
      slot_duration_minutes: found?.slot_duration_minutes ?? 30,
      is_active: found ? found.is_active : false,
    };
  });

/**
 * Admin: edit the weekly schedule of any doctor.
 * Same behaviour as the doctor's own "My Schedule" page.
 */
const DoctorScheduleEditor = ({ doctorId, doctorName }) => {
  const [rows, setRows] = useState(() => buildRows());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(buildRows(await getDoctorSchedule(doctorId)));
      setErrors({});
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = useMemo(() => rows.filter((row) => row.is_active).length, [rows]);

  const updateRow = (day, field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setRows((prev) =>
      prev.map((row) => (row.day_of_week === day ? { ...row, [field]: value } : row))
    );
    setErrors((prev) => ({ ...prev, [day]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const next = {};
    rows.forEach((row) => {
      if (!row.is_active) return;
      if (!row.start_time || !row.end_time) {
        next[row.day_of_week] = 'Choose a start and end time';
      } else if (row.start_time >= row.end_time) {
        next[row.day_of_week] = 'Start time must be before end time';
      }
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const items = rows
        .filter((row) => row.is_active)
        .map((row) => ({
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time,
          slot_duration_minutes: Number(row.slot_duration_minutes),
          is_active: true,
        }));
      const updated = await replaceDoctorSchedule(doctorId, items);
      setRows(buildRows(updated));
      toast.success('Schedule saved');
    } catch (err) {
      toast.error(getErrorToast(err, 'the schedule', 'Could not save the schedule.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ScheduleSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        context="the schedule"
        fallback="We could not load the weekly hours."
        onRetry={load}
        compact
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-base-content">Weekly schedule</h2>
            <p className="text-sm text-base-content/60">
              Days and hours {doctorName ? `${doctorName} accepts` : 'patients can'} bookings.{' '}
              {activeCount} day{activeCount === 1 ? '' : 's'} active.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={saving}
            className="btn btn-ghost btn-sm"
          >
            <FaSyncAlt />
            Reset changes
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Active</th>
                <th>Start</th>
                <th>End</th>
                <th>Slot length</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.day_of_week} className="hover:bg-base-200/60">
                  <td className="font-medium text-base-content">
                    {formatDayOfWeek(row.day_of_week)}
                    {errors[row.day_of_week] && (
                      <p className="text-xs text-error">{errors[row.day_of_week]}</p>
                    )}
                  </td>
                  <td>
                    <CheckboxField
                      label=""
                      checked={row.is_active}
                      onChange={updateRow(row.day_of_week, 'is_active')}
                    />
                  </td>
                  <td>
                    <TextInput
                      type="time"
                      aria-label={`${formatDayOfWeek(row.day_of_week)} start time`}
                      value={row.start_time}
                      onChange={updateRow(row.day_of_week, 'start_time')}
                      disabled={!row.is_active}
                      containerClassName="w-32"
                    />
                  </td>
                  <td>
                    <TextInput
                      type="time"
                      aria-label={`${formatDayOfWeek(row.day_of_week)} end time`}
                      value={row.end_time}
                      onChange={updateRow(row.day_of_week, 'end_time')}
                      disabled={!row.is_active}
                      containerClassName="w-32"
                    />
                  </td>
                  <td>
                    <SelectInput
                      aria-label={`${formatDayOfWeek(row.day_of_week)} slot length`}
                      value={row.slot_duration_minutes}
                      onChange={updateRow(row.day_of_week, 'slot_duration_minutes')}
                      disabled={!row.is_active}
                      containerClassName="w-28"
                      className="select-sm"
                    >
                      {DURATIONS.map((minutes) => (
                        <option key={minutes} value={minutes}>
                          {minutes} min
                        </option>
                      ))}
                    </SelectInput>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton loading={saving}>Save schedule</SubmitButton>
          <p className="text-xs text-base-content/50">
            Disabled days are not offered to patients.
          </p>
        </div>
      </div>
    </form>
  );
};

export default DoctorScheduleEditor;
