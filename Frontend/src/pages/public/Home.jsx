import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  FaArrowRight,
  FaBaby,
  FaBone,
  FaBrain,
  FaCalendarCheck,
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

import ProviderCard from '../../components/common/ProviderCard';
import SelectInput from '../../components/form/SelectInput';
import TextInput from '../../components/form/TextInput';

const specialties = [
  { name: 'Cardiology', icon: FaHeartbeat },
  { name: 'Neurology', icon: FaBrain },
  { name: 'Orthopedics', icon: FaBone },
  { name: 'Pediatrics', icon: FaBaby },
  { name: 'Dentistry', icon: FaTooth },
  { name: 'Eye Care', icon: FaEye },
  { name: 'General Medicine', icon: FaStethoscope },
  { name: 'Family Medicine', icon: FaUserMd },
];

const stats = [
  { value: '500+', label: 'Verified doctors', icon: FaUserCheck },
  { value: '40+', label: 'Specialties', icon: FaStethoscope },
  { value: '12k+', label: 'Appointments booked', icon: FaCalendarCheck },
  { value: '4.9', label: 'Average rating', icon: FaStar },
];

const steps = [
  {
    icon: FaSearch,
    title: 'Find your doctor',
    text: 'Search by specialty, location, or name and compare verified profiles.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Pick a time',
    text: 'Choose a service and a free slot from the doctor\u2019s live schedule.',
  },
  {
    icon: FaUserCheck,
    title: 'Confirm booking',
    text: 'Lock in your appointment and manage everything from one place.',
  },
];

const doctors = [
  {
    id: 1,
    name: 'Dr. Ayesha Rahman',
    specialty: 'Cardiology',
    location: 'Dhaka',
    rating: 4.9,
    reviews: 128,
    fee: 800,
    initials: 'AR',
  },
  {
    id: 2,
    name: 'Dr. Tanvir Hasan',
    specialty: 'Neurology',
    location: 'Chattogram',
    rating: 4.8,
    reviews: 96,
    fee: 1000,
    initials: 'TH',
  },
  {
    id: 3,
    name: 'Dr. Farzana Akter',
    specialty: 'Pediatrics',
    location: 'Khulna',
    rating: 4.9,
    reviews: 154,
    fee: 600,
    initials: 'FA',
  },
  {
    id: 4,
    name: 'Dr. Imran Chowdhury',
    specialty: 'Orthopedics',
    location: 'Sylhet',
    rating: 4.7,
    reviews: 82,
    fee: 900,
    initials: 'IC',
  },
];

const slots = ['09:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '03:30 PM', '04:45 PM'];

const Home = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (specialty) {
      params.set('specialty', specialty);
    }
    if (location.trim()) {
      params.set('location', location.trim());
    }

    const query = params.toString();
    navigate(query ? `/providers?${query}` : '/providers');
  };

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
                  className="border-transparent"
                >
                  <option value="">All specialties</option>
                  {specialties.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </SelectInput>

                <TextInput
                  aria-label="City or area"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City or area"
                  className="border-transparent"
                />

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
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  AR
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-base-content">
                    Dr. Ayesha Rahman
                  </p>
                  <p className="text-sm text-base-content/60">
                    Cardiologist · Dhaka
                  </p>
                </div>
                <span className="badge badge-soft badge-success rounded-full">
                  Available
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Today&apos;s slots
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 xs:grid-cols-3">
                  {slots.map((slot, index) => (
                    <span
                      key={slot}
                      className={`rounded-lg border px-2 py-2 text-center text-xs font-medium ${
                        index === 1
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 bg-base-200 text-base-content/70'
                      }`}
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-base-200 p-3 text-sm text-base-content/70">
                <FaShieldAlt className="text-primary" />
                Free cancellation up to 2 hours before
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
            to="/providers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
          >
            View all doctors <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {specialties.map((item) => (
            <Link
              key={item.name}
              to={`/providers?specialty=${encodeURIComponent(item.name)}`}
              className="card border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200"
            >
              <div className="card-body items-center gap-3 p-5 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
                  <item.icon />
                </span>
                <p className="text-sm font-semibold text-base-content">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
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
              to="/providers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
            >
              View all doctors <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <ProviderCard key={doctor.id} provider={doctor} />
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
              <Link to="/providers" className="btn btn-ghost">
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
