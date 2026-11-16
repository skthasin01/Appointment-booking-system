import { Link } from 'react-router';
import {
  FaCalendarCheck,
  FaHandHoldingHeart,
  FaQuoteLeft,
  FaShieldAlt,
  FaUserCheck,
} from 'react-icons/fa';

import PageHeader from '../../components/common/PageHeader';

const values = [
  {
    icon: FaHandHoldingHeart,
    title: 'Patients first',
    text: 'Every decision starts with the person waiting for care, not the paperwork around it.',
  },
  {
    icon: FaUserCheck,
    title: 'Verified care',
    text: 'Doctors are reviewed before their profiles go live, so you know who you are booking.',
  },
  {
    icon: FaShieldAlt,
    title: 'Transparent',
    text: 'Clear fees, real availability, and no hidden steps between you and your appointment.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Simple by design',
    text: 'A calm booking flow that gets out of the way and respects your time.',
  },
];

const missionStats = [
  { value: '500+', label: 'Doctors onboarded' },
  { value: '40+', label: 'Specialties covered' },
  { value: '12k+', label: 'Appointments booked' },
  { value: '4.9', label: 'Average rating' },
];

const About = () => {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <PageHeader
          eyebrow="About us"
          title="Healthcare scheduling that respects your time"
          description="AppointEase connects patients with verified doctors and turns the appointment booking process into something you can finish in a minute."
        />
      </section>

      <section className="bg-base-200">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Our mission
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
              Make booking care effortless for everyone
            </h2>
            <p className="mt-5 text-base leading-7 text-base-content/60">
              Booking a doctor should not mean phone tag, waiting rooms, and
              paper slips. We built AppointEase so a patient can find the right
              specialist, see genuine open slots, and confirm an appointment in
              a few taps.
            </p>
            <p className="mt-4 text-base leading-7 text-base-content/60">
              For clinics, it means fewer missed calls and a schedule that runs
              itself. For patients, it means care that fits around real life.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                'Verified doctor profiles you can trust',
                'Real-time availability with no double bookings',
                'One place to manage every appointment',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-base-content/70"
                >
                  <FaUserCheck className="mt-0.5 flex-none text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                {missionStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-base-200 p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-base-content">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-base-content/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200 p-5">
                <FaQuoteLeft className="text-primary" />
                <p className="mt-3 text-sm leading-6 text-base-content/70">
                  Booking my mother&apos;s cardiology appointment took less than
                  a minute. No phone calls, no waiting.
                </p>
                <p className="mt-3 text-sm font-semibold text-base-content">
                  Nusrat Jahan
                </p>
                <p className="text-xs text-base-content/50">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            What we stand for
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
            The values behind every booking
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body gap-4 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
                  <value.icon />
                </span>
                <h3 className="text-lg font-semibold text-base-content">
                  {value.title}
                </h3>
                <p className="text-sm leading-6 text-base-content/60">
                  {value.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="card border border-base-300 bg-base-200 shadow-sm">
          <div className="card-body items-center gap-4 p-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Join AppointEase today
            </h2>
            <p className="max-w-xl text-base-content/60">
              Whether you are booking care or providing it, everything starts
              with a free account.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn btn-primary">
                Create free account
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
