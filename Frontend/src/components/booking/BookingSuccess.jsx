import { FaCheckCircle } from "react-icons/fa";

const BookingSuccess = () => {
  return (
    <div className="card border border-base-300 bg-base-100 p-8 text-center shadow-sm">
      <div className="mb-4 flex justify-center">
        <FaCheckCircle className="text-6xl text-success" />
      </div>

      <h1 className="text-2xl font-bold text-base-content">
        Booking Confirmed!
      </h1>

      <p className="mt-2 text-base-content/60">
        Your appointment has been successfully booked.
      </p>
    </div>
  );
};

export default BookingSuccess;
