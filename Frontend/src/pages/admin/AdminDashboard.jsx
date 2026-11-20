import { useMemo } from 'react';
import { Link } from 'react-router';
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaUserMd,
} from 'react-icons/fa';

import Loading from '../../components/common/Loading';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import StatCard from '../../components/dashboard/StatCard';
import useAdminAppointments from '../../hooks/useAdminAppointments';
import { isPastAppointment, todayISO } from '../../utils/formatDate';

const AdminDashboard = () => {
  const { appointments, doctors, usersById, doctorsById, loading, error, reload } =
    useAdminAppointments();

  const stats = useMemo(() => {
    const today = todayISO();
    const active = appointments.filter((item) => item.status !== 'cancelled');
    return {
      total: appointments.length,
      today: active.filter((item) => item.appointment_date === today).length,
      upcoming: active.filter(
        (item) =>
          item.status !== 'completed' &&
          !isPastAppointment(item.appointment_date, item.start_time)
      ).length,
      completed: appointments.filter((item) => item.status === 'completed').length,
      cancelled: appointments.filter((item) => item.status === 'cancelled').length,
      doctors: doctors.length,
      availableDoctors: doctors.filter((item) => item.is_available).length,
    };
  }, [appointments, doctors]);

  if (loading) {
    return <Loading label="Loading dashboard…" className="min-h-[50vh]" />;
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-error">{error}</p>
        <button type="button" onClick={reload} className="btn btn-ghost btn-sm">
          Try again
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total appointments',
      value: stats.total,
      description: `${stats.today} scheduled today`,
      icon: FaCalendarAlt,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Upcoming',
      value: stats.upcoming,
      description: 'Not yet completed',
      icon: FaCalendarCheck,
      color: 'bg-info/10 text-info',
    },
    {
      title: 'Completed',
      value: stats.completed,
      description: 'Finished visits',
      icon: FaCheckCircle,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      description: 'By patients or staff',
      icon: FaTimesCircle,
      color: 'bg-error/10 text-error',
    },
    {
      title: 'Doctors',
      value: stats.doctors,
      description: `${stats.availableDoctors} accepting patients`,
      icon: FaUserMd,
      color: 'bg-secondary/10 text-secondary',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-base-content">
              Recent appointments
            </h2>
            <Link to="/admin/appointments" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <AppointmentTable
            appointments={appointments.slice(0, 8)}
            usersById={usersById}
            doctorsById={doctorsById}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
