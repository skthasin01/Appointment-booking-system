import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  FaArrowRight,
  FaBaby,
  FaBone,
  FaBrain,
  FaCalendarCheck,
  FaClock,
  FaEye,
  FaHeartbeat,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaStethoscope,
  FaTooth,
  FaUserCheck,
  FaUserMd,
} from 'react-icons/fa';

import BookNowButton from '../../components/booking/BookNowButton';
import DoctorCard from '../../components/doctor/DoctorCard';
import DoctorPhoto from '../../components/doctor/DoctorPhoto';
import SelectInput from '../../components/form/SelectInput';
import {
  cities,
  doctors,
  formatDate,
  formatFee,
  formatTime,
  getFeaturedDoctor,
  specialties,
  topRatedDoctors,
} from '../../data/doctors';

const specialtyIcons = {
  Cardiology: FaHeartbeat,
  Neurology: FaBrain,
  Orthopedics: FaBone,
  Pediatrics: FaBaby,
  Dentistry: FaTooth,
  'Eye Care': FaEye,
  'General Medicine': FaStethoscope,
  'Family Medicine': FaUserMd,
};

const averageRating = (
  doctors.reduce((total, doctor) => total + doctor.rating, 0) / doctors.length
).toFixed(1);

const steps = [
  {
    icon: FaSearch,
    title: 'Find your doctor',
    text: 'Search by specialty, city, or name and compare verified profiles.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Pick a time',
    text: 'Choose a free date and time slot from the doctor\u2019s schedule.',
  },
  {
    icon: FaUserCheck,
    title: 'Confirm booking',
    text: 'Lock in your appointment and manage everything from one place.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');

  const spotlight = getFeaturedDoctor();
  const featured = topRatedDoctors(4);
  const heroTimes = spotlight.availableTimes.slice(0, 6);
  const [heroSlot, setHeroSlot] = useState(() => heroTimes[1] || heroTimes[0] || '');

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (specialty) {
      params.set('specialty', specialty);
    }
    if (city) {
      params.set('city', city);
    }

    const query = params.toString();
    navigate(query ? `/doctors?${query}` : '/doctors');
  };

  const stats = [
    { value: `${doctors.length}`, label: 'Verified doctors', icon: FaUserCheck },
    { value: `${specialties.length}`, label: 'Specialties', icon: FaStethoscope },
    { value: '12k+', label: 'Appointments booked', icon: FaCalendarCheck },
    { value: averageRating, label: 'Average rating', icon: FaStar },
  ];

  return (
    <div>
      <section className="bg-base-200">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="badge badge-soft badge-primary rounded-full">
              Trusted by 12,000+ patients
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-base-content sm:text-5xl">
              Book your doctor&apos;s appointment in minutes
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-base-content/60">
              Find verified specialists near you, see their real availability,
              and lock in a time that works — without a single phone call.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm"
            >
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <SelectInput
                  aria-label="Specialty"
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                >
                  <option value="">All specialties</option>
                  {specialties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectInput>

                <SelectInput
                  aria-label="City"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                >
                  <option value="">All cities</option>
                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectInput>

                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  <FaSearch />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-base-content/60">
              <span className="inline-flex items-center gap-2">
                <FaUserCheck className="text-primary" />
                Verified profiles
              </span>
              <span className="inline-flex items-center gap-2">
                <FaCalendarCheck className="text-primary" />
                Instant booking
              </span>
              <span className="inline-flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                Free cancellation
              </span>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-5 p-6">
              <div className="flex items-center gap-4">
                <DoctorPhoto doctor={spotlight} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-base-content">
                    {spotlight.name}
                  </p>
                  <p className="truncate text-sm text-base-content/60">
                    {spotlight.specialty} · {spotlight.city}
                  </p>
                </div>
                <span className="badge badge-soft badge-success rounded-full">
                  Available
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Next slots
                  </p>
                  <p className="text-xs text-base-content/50">
                    {formatDate(spotlight.availableDates[0])}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 xs:grid-cols-3">
                  {heroTimes.map((slot) => {
                    const isSelected = heroSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setHeroSlot(slot)}
                        aria-pressed={isSelected}
                        className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-base-300 bg-base-200 text-base-content/70 hover:border-primary/40 hover:bg-base-100'
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-base-200 p-3 text-sm text-base-content/70">
                <span className="inline-flex items-center gap-2">
                  <FaClock className="text-primary" />
                  {formatFee(spotlight.visitCost)} per visit
                  {heroSlot && (
                    <span className="text-base-content/40">
                      · {formatTime(heroSlot)}
                    </span>
                  )}
                </span>
                <BookNowButton
                  doctor={spotlight}
                  initialDate={spotlight.availableDates[0]}
                  initialTime={heroSlot}
                  className="btn btn-primary btn-sm"
                  label="Book"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-base-200 p-3 text-sm text-base-content/70">
                {spotlight.cancellation ? (
                  <>
                    <FaShieldAlt className="flex-none text-primary" />
                    Free cancellation up to {spotlight.cancellationHours} hours
                    before
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="flex-none text-base-content/40" />
                    Cancellation is not available for this doctor
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body items-center gap-2 p-5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon />
                </span>
                <p className="text-2xl font-bold text-base-content">
                  {stat.value}
                </p>
                <p className="text-sm text-base-content/60">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
              Three steps to your appointment
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
                      <step.icon />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-base-content/40">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-base-content">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-base-content/60">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Specialties
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
              Browse care by specialty
            </h2>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
          >
            View all doctors <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {specialties.map((name) => {
            const Icon = specialtyIcons[name] || FaStethoscope;
            const count = doctors.filter(
              (doctor) => doctor.specialty === name
            ).length;

            return (
              <Link
                key={name}
                to={`/doctors?specialty=${encodeURIComponent(name)}`}
                className="card border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200"
              >
                <div className="card-body items-center gap-3 p-5 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
                    <Icon />
                  </span>
                  <p className="text-sm font-semibold text-base-content">
                    {name}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {count} doctors
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Top rated
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
                Doctors patients trust
              </h2>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
            >
              View all doctors <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="card border border-base-300 bg-base-200 shadow-sm">
          <div className="card-body items-center gap-4 p-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Ready to see a doctor?
            </h2>
            <p className="max-w-xl text-base-content/60">
              Create a free account and book your first appointment in under a
              minute.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn btn-primary">
                Create free account
              </Link>
              <Link to="/doctors" className="btn btn-ghost">
                Browse doctors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
