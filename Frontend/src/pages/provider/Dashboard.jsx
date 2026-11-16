import {
  FaCalendarCheck,
  FaClock,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowRight,
  FaEllipsisH,
} from "react-icons/fa";

import StatCard from "../../components/dashboard/StatCard";

const appointments = [
  {
    id: 1,
    customer: "Rahim Ahmed",
    service: "General Consultation",
    date: "Nov 15, 2026",
    time: "10:00 AM",
    status: "Confirmed",
    initials: "RA",
  },
  {
    id: 2,
    customer: "Karim Hasan",
    service: "Health Checkup",
    date: "Nov 15, 2026",
    time: "11:30 AM",
    status: "Pending",
    initials: "KH",
  },
  {
    id: 3,
    customer: "Nusrat Jahan",
    service: "Follow-up",
    date: "Nov 15, 2026",
    time: "02:00 PM",
    status: "Confirmed",
    initials: "NJ",
  },
  {
    id: 4,
    customer: "Sabbir Hossain",
    service: "Dental Checkup",
    date: "Nov 15, 2026",
    time: "03:30 PM",
    status: "Cancelled",
    initials: "SH",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen space-y-7">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-primary">
            PROVIDER DASHBOARD
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here's what's happening with your appointments.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-slate-400">TODAY</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            November 15, 2026
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value="128"
          description="All time bookings"
          icon={FaCalendarCheck}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Pending Requests"
          value="12"
          description="Waiting for approval"
          icon={FaClock}
          color="bg-amber-100 text-amber-600"
        />

        <StatCard
          title="Total Customers"
          value="85"
          description="Registered customers"
          icon={FaUsers}
          color="bg-emerald-100 text-emerald-600"
        />

        <StatCard
          title="Total Revenue"
          value="৳25,500"
          description="Example revenue"
          icon={FaDollarSign}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                Today's Appointments
              </h2>
              <p className="mt-1 text-xs text-slate-400">Your daily schedule</p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FaCalendarCheck className="text-lg" />
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">08</span>
            <span className="mb-1 text-sm text-slate-400">
              appointments today
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[65%] rounded-full bg-primary" />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            5 completed out of 8 appointments
          </p>
        </div>

        {/* Pending Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Pending Requests</h2>
              <p className="mt-1 text-xs text-slate-400">Need your attention</p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaClock className="text-lg" />
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">12</span>
            <span className="mb-1 text-sm text-slate-400">
              requests waiting
            </span>
          </div>

          <p className="mt-4 text-xs font-medium text-amber-600">
            Review your pending appointments
          </p>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Monthly Revenue</h2>
              <p className="mt-1 text-xs text-slate-400">Revenue overview</p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaDollarSign className="text-lg" />
            </div>
          </div>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800">৳25.5K</span>
          </div>

          <p className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <FaArrowUp />
            Example monthly performance
          </p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Appointments
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage and track your latest bookings
            </p>
          </div>

          <button className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="transition hover:bg-slate-50/70"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {appointment.initials}
                      </div>

                      <span className="text-sm font-semibold text-slate-700">
                        {appointment.customer}
                      </span>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {appointment.service}
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {appointment.date}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {appointment.time}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-600"
                          : appointment.status === "Pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`More options for ${appointment.customer}`}
                    >
                      <FaEllipsisH />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">
            Showing {appointments.length} recent appointments
          </p>
        </div>
      </div>
    </div>
  );
}
