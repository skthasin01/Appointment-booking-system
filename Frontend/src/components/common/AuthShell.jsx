import { FaCalendarCheck, FaShieldAlt, FaStar, FaUserCheck } from 'react-icons/fa';

const benefits = [
  {
    icon: FaUserCheck,
    title: 'Verified doctors',
    text: 'Every profile is reviewed before it goes live.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Live availability',
    text: 'Only real, open time slots are shown.',
  },
  {
    icon: FaShieldAlt,
    title: 'Free cancellation',
    text: 'Change your plans without the hassle.',
  },
];

const AuthShell = ({ title, subtitle, children, footer }) => (
  <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
    <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
      <div className="flex items-center">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-base-content/60">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          {footer && (
            <div className="mt-6 text-center text-sm text-base-content/60">
              {footer}
            </div>
          )}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="card h-full border border-base-300 bg-base-200 shadow-sm">
          <div className="card-body justify-center gap-8 p-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-base-content">
                Care that fits your schedule
              </h2>
              <p className="mt-3 text-sm leading-6 text-base-content/60">
                Book trusted doctors, choose a time that works for you, and keep
                every appointment in one place.
              </p>
            </div>

            <ul className="space-y-5">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <benefit.icon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-base-content">
                      {benefit.title}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {benefit.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    AR
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-base-content">
                      Dr. Ayesha Rahman
                    </p>
                    <p className="text-xs text-base-content/60">
                      Cardiologist · Dhaka
                    </p>
                  </div>
                  <span className="badge badge-soft badge-success rounded-full">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-base-content/70">
                    <FaCalendarCheck className="text-primary" />
                    Nov 18, 2026
                  </span>
                  <span className="font-semibold text-base-content">
                    10:30 AM
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-sm text-base-content/60">
                  <FaStar className="text-warning" />
                  4.9 · 128 reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
);

export default AuthShell;
