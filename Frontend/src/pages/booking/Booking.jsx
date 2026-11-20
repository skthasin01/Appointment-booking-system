import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { bookAppointment } from '../../api/appointments';
import { getDoctor } from '../../api/doctors';
import { getAvailableSlots } from '../../api/schedules';
import Loading from '../../components/common/Loading';
import BookingForm from '../../components/appointments/BookingForm';
import DatePicker from '../../components/appointments/DatePicker';
import TimeSlotPicker from '../../components/appointments/TimeSlotPicker';
import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import { addDaysISO, parseISODate } from '../../utils/formatDate';
import getErrorMessage from '../../utils/getErrorMessage';

const BOOKING_WINDOW_DAYS = 14;
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const firstWorkingDate = (workingDays) => {
  for (let index = 0; index < BOOKING_WINDOW_DAYS; index += 1) {
    const iso = addDaysISO(index);
    if (workingDays.includes(DAY_KEYS[parseISODate(iso).getDay()])) return iso;
  }
  return '';
};

const Booking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState('');

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const workingDays = useMemo(
    () => [
      ...new Set(
        (doctor?.schedules || [])
          .filter((item) => item.is_active)
          .map((item) => item.day_of_week)
      ),
    ],
    [doctor]
  );

  // Load doctor
  useEffect(() => {
    let active = true;
    setDoctorLoading(true);
    setDoctorError('');

    getDoctor(doctorId)
      .then((data) => {
        if (!active) return;
        setDoctor(data);
        const days = (data.schedules || [])
          .filter((item) => item.is_active)
          .map((item) => item.day_of_week);
        setDate(firstWorkingDate(days));
      })
      .catch((err) => {
        if (active) {
          setDoctorError(
            err.response?.status === 404
              ? 'This doctor does not exist.'
              : getErrorMessage(err, 'Could not load the doctor.')
          );
        }
      })
      .finally(() => {
        if (active) setDoctorLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctorId]);

  // Load slots whenever the date changes
  const loadSlots = useCallback(async () => {
    if (!date) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    setSlotsError('');
    setSelectedSlot(null);
    try {
      setSlots(await getAvailableSlots(doctorId, date));
    } catch (err) {
      setSlots([]);
      setSlotsError(getErrorMessage(err, 'Could not load available slots.'));
    } finally {
      setSlotsLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleSubmit = async () => {
    if (!selectedSlot || !date) return;
    setSubmitting(true);
    try {
      const appointment = await bookAppointment({
        doctor_id: doctor.id,
        appointment_date: date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes: notes.trim() || null,
      });
      toast.success('Appointment booked');
      navigate('/booking/success', {
        replace: true,
        state: { appointment, doctor },
      });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not book this slot. Please try another.'));
      // The slot may have just been taken — refresh the list
      loadSlots();
    } finally {
      setSubmitting(false);
    }
  };

  if (doctorLoading) {
    return <Loading label="Preparing booking…" />;
  }

  if (doctorError) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-xl text-error">
          <FaExclamationTriangle />
        </span>
        <p className="text-sm text-base-content/70">{doctorError}</p>
        <Link to="/doctors" className="btn btn-primary">
          Browse doctors
        </Link>
      </section>
    );
  }

  const unavailable = !doctor.is_available || workingDays.length === 0;

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
      <Link
        to={`/doctors/${doctor.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary"
      >
        <FaArrowLeft className="text-xs" />
        Back to profile
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <DoctorAvatar name={doctor.name} imageUrl={doctor.image_url} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content">
            Book with {doctor.name}
          </h1>
          <p className="text-sm text-base-content/60">
            {[doctor.specialty, doctor.location].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      {unavailable ? (
        <div className="mt-8 rounded-xl bg-warning/10 p-6 text-sm text-base-content/70">
          This doctor is not accepting bookings right now. Please choose another doctor.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-5">
                <h2 className="font-semibold text-base-content">1. Choose a date</h2>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  workingDays={workingDays}
                  days={BOOKING_WINDOW_DAYS}
                />
              </div>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-5">
                <h2 className="font-semibold text-base-content">2. Choose a time</h2>
                {date ? (
                  <TimeSlotPicker
                    slots={slots}
                    loading={slotsLoading}
                    error={slotsError}
                    selected={selectedSlot}
                    onSelect={setSelectedSlot}
                    onRetry={loadSlots}
                  />
                ) : (
                  <p className="text-sm text-base-content/60">
                    No working days in the next {BOOKING_WINDOW_DAYS} days.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card sticky top-24 border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-5">
                <h2 className="font-semibold text-base-content">3. Confirm</h2>
                <BookingForm
                  doctor={doctor}
                  date={date}
                  slot={selectedSlot}
                  notes={notes}
                  onNotesChange={setNotes}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Booking;
