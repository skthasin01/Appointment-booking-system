import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { bookAppointment } from '../../api/appointments';
import { getDoctor } from '../../api/doctors';
import { getAvailableSlots } from '../../api/schedules';
import ErrorState from '../../components/common/ErrorState';
import { BookingSkeleton } from '../../components/common/Skeletons';
import BookingForm from '../../components/appointments/BookingForm';
import DatePicker from '../../components/appointments/DatePicker';
import TimeSlotPicker from '../../components/appointments/TimeSlotPicker';
import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import { addDaysISO, parseISODate } from '../../utils/formatDate';
import { getErrorToast } from '../../utils/getErrorMessage';

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
  const location = useLocation();
  // Optional { date, slot } chosen on another page (e.g. the Home page)
  const preselect = useRef(location.state ?? null);

  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
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
    setDoctorError(null);

    getDoctor(doctorId)
      .then((data) => {
        if (!active) return;
        setDoctor(data);
        const days = (data.schedules || [])
          .filter((item) => item.is_active)
          .map((item) => item.day_of_week);
        const wanted = preselect.current?.date;
        const wantedIsValid =
          wanted &&
          wanted >= addDaysISO(0) &&
          wanted <= addDaysISO(BOOKING_WINDOW_DAYS - 1) &&
          days.includes(DAY_KEYS[parseISODate(wanted).getDay()]);
        setDate(wantedIsValid ? wanted : firstWorkingDate(days));
      })
      .catch((err) => {
        if (active) {
          setDoctorError(err);
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
    setSlotsError(null);
    setSelectedSlot(null);
    try {
      const data = await getAvailableSlots(doctorId, date);
      setSlots(data);
      // Pre-select the slot chosen on the previous page (only once)
      const wanted = preselect.current;
      if (wanted?.slot && wanted.date === date) {
        const match = data.find((item) => item.start_time === wanted.slot.start_time);
        if (match) setSelectedSlot(match);
        preselect.current = null;
      }
    } catch (err) {
      setSlots([]);
      setSlotsError(err);
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
        // Required by the API: null = the signed-in patient books for themselves
        patient_id: null,
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
      toast.error(
        getErrorToast(err, 'the booking', 'Could not book this slot. Please try another.')
      );
      // The slot may have just been taken — refresh the list
      loadSlots();
    } finally {
      setSubmitting(false);
    }
  };

  if (doctorLoading) {
    return <BookingSkeleton />;
  }

  if (doctorError) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12">
        <ErrorState
          error={doctorError}
          context="this doctor"
          fallback="We could not prepare the booking page."
          description={
            doctorError?.response?.status === 404
              ? 'This doctor no longer exists. Browse the doctor list to choose another specialist.'
              : undefined
          }
        >
          <Link to="/doctors" className="btn btn-ghost btn-sm mt-3">
            Browse doctors
          </Link>
        </ErrorState>
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
