import { Link } from 'react-router';
import {
  FaArrowRight,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaUsers,
} from 'react-icons/fa';

import AppointmentStatusBadge from '../../components/appointments/AppointmentStatusBadge';
import ErrorState from '../../components/common/ErrorState';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import StatCard from '../../components/dashboard/StatCard';
import useAuth from '../../hooks/useAuth';
import useDoctorDashboard from '../../hooks/useDoctorDashboard';
import { formatDate, formatTimeRange, todayISO } from '../../utils/formatDate';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'P';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, appointments, loading, error, reload } = useDoctorDashboard();
  const recent = appointments.slice(0, 5);
  const today = formatDate(todayISO(), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        context="your dashboard"
        fallback="We could not load your appointment summary."
        onRetry={reload}
      />
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Doctor dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-base-content md:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-base-content/60">
            Welcome back{user?.name ? `, ${user.name}` : ''}. Here&apos;s what&apos;s
            happening with your appointments.
          </p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
            Today
          </p>
          <p className="mt-1 text-sm font-semibold text-base-content">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={stats?.total_appointments ?? 0}
          description="All time bookings"
          icon={FaCalendarCheck}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Today's Appointments"
          value={stats?.today_appointments ?? 0}
          description="Scheduled for today"
          icon={FaClock}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Total Patients"
          value={stats?.total_patients ?? 0}
          description="Patients you have seen"
          icon={FaUsers}
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="Completed"
          value={stats?.completed ?? 0}
          description="Consultations finished"
          icon={FaCheckCircle}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base-content">
                Today&apos;s Appointments
              </h2>
              <p className="mt-1 text-xs text-base-content/50">Your daily schedule</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FaCalendarCheck />
            </div>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-3xl font-bold text-base-content">
              {stats?.today_appointments ?? 0}
            </span>
            <span className="mb-1 text-sm text-base-content/50">
              appointments today
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base-content">Confirmed</h2>
              <p className="mt-1 text-xs text-base-content/50">Ready to check in</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock />
            </div>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-3xl font-bold text-base-content">
              {stats?.confirmed ?? 0}
            </span>
            <span className="mb-1 text-sm text-base-content/50">bookings</span>
          </div>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base-content">Completed</h2>
              <p className="mt-1 text-xs text-base-content/50">Consultations finished</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaCheckCircle />
            </div>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-3xl font-bold text-base-content">
              {stats?.completed ?? 0}
            </span>
            <span className="mb-1 text-sm text-base-content/50">in total</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-base-300 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-base-content">Recent Appointments</h2>
            <p className="mt-1 text-sm text-base-content/50">
              Manage and track your latest bookings
            </p>
          </div>
          <Link to="/doctor/appointments" className="btn btn-ghost btn-sm gap-2">
            View All <FaArrowRight />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-10 text-center text-sm text-base-content/60">
            No appointments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date &amp; time</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id} className="hover:bg-base-200/60">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {initialsOf(item.patient?.name)}
                        </span>
                        <span className="text-sm font-medium text-base-content">
                          {item.patient?.name || `Patient #${item.patient_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      <p className="text-sm text-base-content">
                        {formatDate(item.appointment_date)}
                      </p>
                      <p className="text-xs text-base-content/50">
                        {formatTimeRange(item.start_time, item.end_time)}
                      </p>
                    </td>
                    <td className="max-w-xs text-sm text-base-content/60">
                      <span className="line-clamp-1">{item.notes || '—'}</span>
                    </td>
                    <td>
                      <AppointmentStatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
