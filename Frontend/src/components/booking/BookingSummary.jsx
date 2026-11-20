import { Link } from "react-router";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

const BookingSummary = ({ booking }) => {
  const details = [
    {
      icon: <FaClipboardList />,
      label: "Booking ID",
      value: booking.bookingId,
    },
    {
      icon: <FaUser />,
      label: "Patient",
      value: booking.customer,
    },
    {
      icon: <FaUserMd />,
      label: "Doctor",
      value: booking.service,
    },
    {
      icon: <FaCalendarAlt />,
      label: "Appointment Date",
      value: booking.date,
    },
    {
      icon: <FaClock />,
      label: "Appointment Time",
      value: booking.time,
    },
  ].filter((item) => item.value);

  return (
    <div className="card border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-xl font-semibold text-base-content">
        Booking Summary
      </h2>

      <div className="space-y-5">
        {details.map((item) => (
          <div key={item.label} className="flex items-start gap-4">
            <div className="rounded-xl bg-base-200 p-3 text-base-content/60">
              {item.icon}
            </div>

            <div>
              <p className="text-sm text-base-content/60">{item.label}</p>
              <p className="font-medium text-base-content">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-base-300 pt-5">
        <span className="text-base-content/60">Booking Status</span>

        <span className="flex items-center gap-2 font-medium text-success">
          <FaCheckCircle />
          {booking.status}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/my-appointments" className="btn btn-primary flex-1">
          View My Bookings
        </Link>

        <Link to="/" className="btn btn-ghost flex-1 border-base-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingSummary;
