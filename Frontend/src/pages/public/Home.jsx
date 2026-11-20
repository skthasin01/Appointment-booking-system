import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { getDoctors } from '../../api/doctors';
import { getAvailableSlots } from '../../api/schedules';
import ErrorState from '../../components/common/ErrorState';
import { Bar, DoctorCardSkeleton } from '../../components/common/Skeletons';
import DoctorAvatar from '../../components/doctors/DoctorAvatar';
import DoctorCard from '../../components/doctors/DoctorCard';
import SelectInput from '../../components/form/SelectInput';
import useAuth from '../../hooks/useAuth';
import { addDaysISO, formatDate, formatTime, parseISODate } from '../../utils/formatDate';

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

const steps = [
  {
    icon: FaSearch,
    title: 'Find your doctor',
    text: 'Search by specialty, city, or name and compare verified profiles.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Pick a time',
    text: 'Choose a free date and time slot from the doctor’s schedule.',
  },
  {
    icon: FaUserCheck,
    title: 'Confirm booking',
    text: 'Lock in your appointment and manage everything from one place.',
  },
];

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const LOOKAHEAD_DAYS = 14;

// "Motijheel, Dhaka" -> "Dhaka"
const cityOf = (location) => location?.split(',').pop().trim() || '';

const workingDaysOf = (doctor) =>
  (doctor?.schedules || [])
    .filter((item) => item.is_active)
    .map((item) => item.day_of_week);

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Spotlight doctor's next free slots
  const [slotDate, setSlotDate] = useState('');
  const [heroTimes, setHeroTimes] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotRetry, setSlotRetry] = useState(0);
  const [heroSlot, setHeroSlot] = useState(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDoctors(await getDoctors());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getDoctors()
      .then((data) => {
        if (active) setDoctors(data);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const byRating = useMemo(
    () => [...doctors].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [doctors]
  );

  // Highest-rated doctor who is accepting patients and has working hours
  const spotlight = useMemo(
    () => byRating.find((doctor) => doctor.is_available && workingDaysOf(doctor).length) || null,
    [byRating]
  );

  const featured = byRating.slice(0, 4);

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean))].sort(),
    [doctors]
  );

  const cities = useMemo(
    () => [...new Set(doctors.map((doctor) => cityOf(doctor.location)).filter(Boolean))].sort(),
    [doctors]
  );

  const averageRating = doctors.length
    ? (doctors.reduce((total, doctor) => total + (doctor.rating ?? 0), 0) / doctors.length).toFixed(1)
    : '–';

  // Find the spotlight doctor's first day (within 2 weeks) that still has free slots
  useEffect(() => {
    if (!spotlight) return undefined;

    let active = true;
    const workingDays = workingDaysOf(spotlight);
    const candidates = Array.from({ length: LOOKAHEAD_DAYS }, (_, index) => addDaysISO(index)).filter(
      (iso) => workingDays.includes(DAY_KEYS[parseISODate(iso).getDay()])
    );

    const findSlots = async () => {
      setSlotsError(null);
      setSlotsLoading(true);
      for (const iso of candidates) {
        try {
          const slots = await getAvailableSlots(spotlight.id, iso);
          if (!active) return;
          if (slots.length) {
            const shown = slots.slice(0, 6);
            setSlotDate(iso);
            setHeroTimes(shown);
            setHeroSlot(shown[0]);
            break;
          }
        } catch (err) {
          if (active) setSlotsError(err);
          break;
        }
      }
      if (active) setSlotsLoading(false);
    };

    findSlots();

    return () => {
      active = false;
    };
  }, [spotlight, slotRetry]);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (specialty) {
      params.set('specialty', specialty);
    }
    if (city) {
      params.set('location', city);
    }

    const query = params.toString();
    navigate(query ? `/doctors?${query}` : '/doctors');
  };

  const handleBook = () => {
    if (!spotlight) return;
    navigate(`/book/${spotlight.id}`, {
      state: heroSlot ? { date: slotDate, slot: heroSlot } : undefined,
    });
  };

  const stats = [
    { value: doctors.length, label: 'Verified doctors', icon: FaUserCheck, loading },
    { value: specialties.length, label: 'Specialties', icon: FaStethoscope, loading },
    { value: '12k+', label: 'Appointments booked', icon: FaCalendarCheck },
    { value: averageRating, label: 'Average rating', icon: FaStar, loading },
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
            {loading ? (
              <div
                className="card-body gap-4 p-6"
                role="status"
                aria-label="Loading featured doctor"
                aria-busy="true"
              >
                <Bar className="h-14 w-full rounded-xl" />
                <Bar className="h-24 w-full rounded-xl" />
                <Bar className="h-12 w-full rounded-xl" />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorState
                  error={error}
                  context="doctors"
                  fallback="We could not load the featured doctors."
                  onRetry={loadDoctors}
                  compact
                />
              </div>
            ) : !spotlight ? (
              <div className="card-body items-center gap-3 p-8 text-center">
                <FaUserMd className="text-3xl text-base-content/30" />
                <p className="text-sm text-base-content/60">
                  No doctors are accepting bookings right now.
                </p>
                <Link to="/doctors" className="btn btn-ghost btn-sm">
                  Browse doctors
                </Link>
              </div>
            ) : (
              <div className="card-body gap-5 p-6">
                <div className="flex items-center gap-4">
                  <DoctorAvatar name={spotlight.name} imageUrl={spotlight.image_url} />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/doctors/${spotlight.id}`}
                      className="block truncate font-semibold text-base-content hover:text-primary"
                    >
                      {spotlight.name}
                    </Link>
                    <p className="truncate text-sm text-base-content/60">
                      {spotlight.specialty} · {cityOf(spotlight.location)}
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
                      {slotDate ? formatDate(slotDate) : ''}
                    </p>
                  </div>
                  {slotsLoading ? (
                    <div
                      className="mt-3 grid grid-cols-2 gap-2 xs:grid-cols-3"
                      role="status"
                      aria-label="Loading available slots"
                      aria-busy="true"
                    >
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Bar key={index} className="h-9 rounded-lg" />
                      ))}
                    </div>
                  ) : slotsError ? (
                    <div className="mt-3">
                      <ErrorState
                        error={slotsError}
                        context="available slots"
                        fallback="We could not check this doctor's next openings."
                        onRetry={() => setSlotRetry((value) => value + 1)}
                        compact
                      />
                    </div>
                  ) : heroTimes.length === 0 ? (
                    <p className="mt-3 text-sm text-base-content/60">
                      No free slots in the next two weeks.
                    </p>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2 xs:grid-cols-3">
                      {heroTimes.map((slot) => {
                        const isSelected = heroSlot?.start_time === slot.start_time;

                        return (
                          <button
                            key={slot.start_time}
                            type="button"
                            onClick={() => setHeroSlot(slot)}
                            aria-pressed={isSelected}
                            className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-base-300 bg-base-200 text-base-content/70 hover:border-primary/40 hover:bg-base-100'
                            }`}
                          >
                            {formatTime(slot.start_time)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-base-200 p-3 text-sm text-base-content/70">
                  <span className="inline-flex items-center gap-2">
                    <FaClock className="text-primary" />
                    ৳{spotlight.consultation_fee} per visit
                    {heroSlot && (
                      <span className="text-base-content/40">
                        · {formatTime(heroSlot.start_time)}
                      </span>
                    )}
                  </span>
                  <button type="button" onClick={handleBook} className="btn btn-primary btn-sm">
                    Book
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-base-200 p-3 text-sm text-base-content/70">
                  <FaShieldAlt className="flex-none text-primary" />
                  {spotlight.free_cancellation
                    ? 'Free cancellation'
                    : `Cancellation fee: ৳${spotlight.cancellation_fee}`}
                </div>
              </div>
            )}
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
                <p className="flex h-8 items-center justify-center text-2xl font-bold text-base-content">
                  {stat.loading ? (
                    <Bar className="h-7 w-16 rounded-lg" />
                  ) : (
                    stat.value
                  )}
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
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <Bar key={index} className="h-36 rounded-box" />
            ))}
          {!loading && specialties.length === 0 && (
            <p className="col-span-full text-sm text-base-content/60">
              No specialties to show yet.
            </p>
          )}
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
                    {count} doctor{count === 1 ? '' : 's'}
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
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <DoctorCardSkeleton key={index} />
              ))}
            {!loading && error && (
              <div className="col-span-full">
                <ErrorState
                  error={error}
                  context="top rated doctors"
                  fallback="We could not load the doctor list."
                  onRetry={loadDoctors}
                  compact
                />
              </div>
            )}
            {!loading && !error && featured.length === 0 && (
              <p className="col-span-full text-sm text-base-content/60">
                No doctors to show yet.
              </p>
            )}
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
              {isAuthenticated
                ? 'You are logged in. Browse doctors and book your next appointment.'
                : 'Create a free account and book your first appointment in under a minute.'}
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {isAuthenticated ? (
                <span className="badge badge-soft badge-success rounded-full px-4 py-3 text-sm font-semibold">
                  Logged in
                </span>
              ) : (
                <Link to="/register" className="btn btn-primary">
                  Create free account
                </Link>
              )}
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
