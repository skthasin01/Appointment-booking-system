import { Link, useLocation } from "react-router";

import BookingSuccess from "../../components/booking/BookingSuccess";
import BookingSummary from "../../components/booking/BookingSummary";
import useAuth from "../../hooks/useAuth";
import { formatDate, formatTimeRange } from "../../utils/formatDate";

const STATUS_LABELS = {
  confirmed: "Confirmed",
  checked_in: "Checked in",
  in_consultation: "In consultation",
  completed: "Completed",
  cancelled: "Cancelled",
};

const BookingConfirmation = () => {
  const { state } = useLocation();
  const { user } = useAuth();

  const appointment = state?.appointment;
  const doctor = state?.doctor;

  // Reached directly (e.g. page refresh) — there is no booking in router state
  if (!appointment) {
    return (
      <div className="bg-base-200 px-4 py-20">
        <div className="card mx-auto max-w-md border border-base-300 bg-base-100 p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-base-content">
            No booking to show
          </h1>
          <p className="mt-2 text-sm text-base-content/60">
            Your appointments are always available in My Appointments.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/my-appointments" className="btn btn-primary flex-1">
              My Appointments
            </Link>
            <Link to="/doctors" className="btn btn-ghost flex-1">
              Find a doctor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const booking = {
    bookingId: `APT-${appointment.id}`,
    customer: user?.name,
    service: doctor
      ? `${doctor.name}${doctor.specialty ? ` · ${doctor.specialty}` : ""}`
      : `Doctor #${appointment.doctor_id}`,
    date: formatDate(appointment.appointment_date, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: formatTimeRange(appointment.start_time, appointment.end_time),
    status: STATUS_LABELS[appointment.status] || appointment.status,
  };

  return (
    <div className="bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <BookingSuccess />

        <BookingSummary booking={booking} />
      </div>
    </div>
  );
};

export default BookingConfirmation;
