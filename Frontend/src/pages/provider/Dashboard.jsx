import {
  FaCalendarCheck,
  FaClock,
  FaUsers,
  FaDollarSign
} from "react-icons/fa";
import StatCard from "../../components/dashboard/Statcard";



const appointments = [
  {
    id: 1,
    customer: "Rahim Ahmed",
    service: "General Consultation",
    time: "10:00 AM",
    status: "Confirmed"
  },
  {
    id: 2,
    customer: "Karim Hasan",
    service: "Health Checkup",
    time: "11:30 AM",
    status: "Pending"
  },
  {
    id: 3,
    customer: "Nusrat Jahan",
    service: "Follow-up",
    time: "02:00 PM",
    status: "Confirmed"
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Here is what's happening with your appointments.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

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
          color="bg-yellow-100 text-yellow-600"
        />

        <StatCard
          title="Total Customers"
          value="85"
          description="Registered customers"
          icon={FaUsers}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Total Revenue"
          value="৳25,500"
          description="Example revenue"
          icon={FaDollarSign}
          color="bg-purple-100 text-purple-600"
        />

      </div>

      {/* Recent appointments */}

      <div className="bg-white rounded-xl border border-slate-200
        shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Appointments
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}
                  className="border-t border-slate-100">

                  <td className="p-4 font-medium text-slate-700">
                    {appointment.customer}
                  </td>

                  <td className="p-4 text-slate-500">
                    {appointment.service}
                  </td>

                  <td className="p-4 text-slate-500">
                    {appointment.time}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs
                      font-medium ${
                        appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {appointment.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}