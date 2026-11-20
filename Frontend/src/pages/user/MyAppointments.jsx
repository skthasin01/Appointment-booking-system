import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { FaCalendarPlus, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { cancelAppointment, getMyAppointments } from '../../api/appointments';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import useAuth from '../../hooks/useAuth';
import useDoctorLookup from '../../hooks/useDoctorLookup';
import { isPastAppointment } from '../../utils/formatDate';
import getErrorMessage from '../../utils/getErrorMessage';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

const categorize = (appointment) => {
  if (appointment.status === 'cancelled') return 'cancelled';
  if (
    appointment.status === 'completed' ||
    isPastAppointment(appointment.appointment_date, appointment.start_time)
  ) {
    return 'past';
  }
  return 'upcoming';
};

const MyAppointments = () => {
  const { isPatient } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAppointments(await getMyAppointments());
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your appointments.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const doctorIds = useMemo(
    () => appointments.map((item) => item.doctor_id),
    [appointments]
  );
  const doctors = useDoctorLookup(doctorIds);

  const grouped = useMemo(() => {
    const groups = { upcoming: [], past: [], cancelled: [] };
    appointments.forEach((item) => groups[categorize(item)].push(item));
    // Upcoming: soonest first. API already returns newest first for the others.
    groups.upcoming.reverse();
    return groups;
  }, [appointments]);

  const handleCancel = async (appointment) => {
    setCancellingId(appointment.id);
    try {
      const updated = await cancelAppointment(appointment.id);
      setAppointments((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      toast.success('Appointment cancelled');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not cancel the appointment.'));
    } finally {
      setCancellingId(null);
    }
  };

  const visible = grouped[tab];

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <PageHeader
        eyebrow="Your bookings"
        title="My appointments"
        description="See upcoming visits, review past ones and cancel if your plans change."
      />

      {loading ? (
        <Loading label="Loading appointments…" className="min-h-[40vh]" />
      ) : error ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-xl text-error">
            <FaExclamationTriangle />
          </span>
          <p className="text-sm text-base-content/70">{error}</p>
          <button type="button" onClick={loadAppointments} className="btn btn-ghost btn-sm">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div role="tablist" className="tabs tabs-box mx-auto mt-10 w-fit">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={tab === item.key}
                onClick={() => setTab(item.key)}
                className={`tab ${tab === item.key ? 'tab-active' : ''}`}
              >
                {item.label}
                <span className="ml-2 text-xs opacity-60">
                  {grouped[item.key].length}
                </span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="text-sm text-base-content/60">
                {tab === 'upcoming'
                  ? 'You have no upcoming appointments.'
                  : `No ${tab} appointments.`}
              </p>
              {tab === 'upcoming' && isPatient && (
                <Link to="/doctors" className="btn btn-primary">
                  <FaCalendarPlus />
                  Book an appointment
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {visible.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  doctor={doctors[appointment.doctor_id]}
                  onCancel={
                    isPatient && tab === 'upcoming' && appointment.status === 'confirmed'
                      ? handleCancel
                      : undefined
                  }
                  cancelling={cancellingId === appointment.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MyAppointments;
