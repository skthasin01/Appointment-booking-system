import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  FaArrowLeft,
  FaBriefcaseMedical,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaGlobe,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaStar,
  FaStethoscope,
  FaTimesCircle,
  FaUserMd,
} from 'react-icons/fa';

import BookNowButton from '../../components/booking/BookNowButton';
import DoctorPhoto from '../../components/doctor/DoctorPhoto';
import {
  formatDate,
  formatFee,
  formatTime,
  getDoctorById,
} from '../../data/doctors';

const DoctorDetails = () => {
  const { id } = useParams();
  const doctor = getDoctorById(id);

  const [selectedDate, setSelectedDate] = useState(
    () => doctor?.availableDates[0] || ''
  );
  const [selectedTime, setSelectedTime] = useState('');

  if (!doctor) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-2xl text-base-content/40">
          <FaUserMd />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-base-content">
          Doctor not found
        </h1>
        <p className="mt-3 text-base-content/60">
          This profile may have been removed or the link is out of date.
        </p>
        <Link to="/doctors" className="btn btn-primary mt-8">
          <FaArrowLeft />
          Browse doctors
        </Link>
      </section>
    );
  }

  return (
    <div>
      <section className="border-b border-base-300 bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary"
          >
            <FaArrowLeft className="text-xs" />
            Back to doctors
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <DoctorPhoto doctor={doctor} size="xl" />

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                {doctor.name}
              </h1>
              <p className="mt-1 text-base text-base-content/60">
                {doctor.specialty}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-content/60">
                <span className="inline-flex items-center gap-1.5">
                  <FaStar className="text-warning" />
                  <span className="font-semibold text-base-content">
                    {doctor.rating}
                  </span>
                  <span className="text-base-content/40">
                    ({doctor.ratingCount} ratings)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-base-content/40" />
                  {doctor.area}, {doctor.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaBriefcaseMedical className="text-base-content/40" />
                  {doctor.experienceYears} years experience
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="badge badge-soft badge-primary rounded-full">
                  {formatFee(doctor.visitCost)} per visit
                </span>
                {doctor.cancellation ? (
                  <span className="badge badge-soft badge-success rounded-full">
                    Cancellation supported
                  </span>
                ) : (
                  <span className="badge badge-soft badge-error rounded-full">
                    No cancellation
                  </span>
                )}
                {doctor.availableDates.length > 0 && (
                  <span className="badge badge-soft rounded-full">
                    Next available {formatDate(doctor.availableDates[0])}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-6">
                <h2 className="text-xl font-semibold text-base-content">
                  About {doctor.name}
                </h2>
                <p className="text-sm leading-7 text-base-content/70">
                  {doctor.profile}
                </p>

                <div className="grid gap-4 border-t border-base-300 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                      Qualifications
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {doctor.qualifications.map((item) => (
                        <li
                          key={item}
                          className="inline-flex items-start gap-2 text-sm text-base-content/70"
                        >
                          <FaCheckCircle className="mt-0.5 flex-none text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                      Details
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-base-content/70">
                      <li className="inline-flex items-center gap-2">
                        <FaStethoscope className="flex-none text-base-content/40" />
                        {doctor.specialty}
                      </li>
                      <li className="inline-flex items-center gap-2">
                        <FaUserMd className="flex-none text-base-content/40" />
                        {doctor.patientsTreated.toLocaleString('en-US')} patients
                        treated
                      </li>
                      <li className="inline-flex items-center gap-2">
                        <FaGlobe className="flex-none text-base-content/40" />
                        {doctor.languages.join(', ')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-5 p-6">
                <div>
                  <h2 className="text-xl font-semibold text-base-content">
                    Availability
                  </h2>
                  <p className="mt-1 text-sm text-base-content/60">
                    Pick a date and a time, then confirm your booking.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Available dates
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {doctor.availableDates.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSelectedDate(value);
                          setSelectedTime('');
                        }}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          selectedDate === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-base-300 bg-base-200 text-base-content/70 hover:bg-base-100'
                        }`}
                      >
                        {formatDate(value)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Available times
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 xs:grid-cols-3">
                    {doctor.availableTimes.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedTime(value)}
                        className={`rounded-lg border px-2 py-2 text-center text-sm font-medium transition-colors ${
                          selectedTime === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-base-300 bg-base-200 text-base-content/70 hover:bg-base-100'
                        }`}
                      >
                        {formatTime(value)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body flex-row items-start gap-4 p-6">
                <span
                  className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
                    doctor.cancellation
                      ? 'bg-success/10 text-success'
                      : 'bg-base-200 text-base-content/40'
                  }`}
                >
                  {doctor.cancellation ? <FaShieldAlt /> : <FaTimesCircle />}
                </span>
                <div>
                  <h2 className="font-semibold text-base-content">
                    Cancellation policy
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-base-content/60">
                    {doctor.cancellation
                      ? `This doctor supports free cancellation up to ${doctor.cancellationHours} hours before the appointment. Cancel after that window and the visit fee is not refunded.`
                      : 'This doctor does not accept cancellations once an appointment is confirmed. Please make sure the slot works before booking.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-6">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm text-base-content/60">Visit cost</p>
                  <p className="text-2xl font-bold text-base-content">
                    {formatFee(doctor.visitCost)}
                  </p>
                </div>

                <div className="space-y-2 rounded-xl bg-base-200 p-4 text-sm">
                  <p className="inline-flex w-full items-center gap-2 text-base-content/70">
                    <FaCalendarAlt className="text-primary" />
                    {selectedDate ? formatDate(selectedDate) : 'Pick a date'}
                  </p>
                  <p className="inline-flex w-full items-center gap-2 text-base-content/70">
                    <FaClock className="text-primary" />
                    {selectedTime
                      ? formatTime(selectedTime)
                      : 'Pick a time'}
                  </p>
                </div>

                <BookNowButton
                  doctor={doctor}
                  initialDate={selectedDate}
                  initialTime={selectedTime}
                  className="btn btn-primary w-full"
                  label="Book now"
                />

                <p className="text-center text-xs text-base-content/50">
                  No payment is taken until you confirm the appointment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default DoctorDetails;
