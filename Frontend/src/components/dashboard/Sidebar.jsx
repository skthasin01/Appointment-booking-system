import {
  FaHome,
  FaCalendarCheck,
  FaCalendarAlt,
  FaBriefcase,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: FaHome, path: "/provider/dashboard" },
  { name: "Appointments", icon: FaCalendarCheck, path: "/provider/appointments" },
  { name: "My Schedule", icon: FaCalendarAlt, path: "/provider/schedule" },
  { name: "My Services", icon: FaBriefcase, path: "/provider/services" },
  { name: "My Profile", icon: FaUser, path: "/provider/profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">

      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-blue-600">
          Appoint<span className="text-slate-800">Ease</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provider Dashboard
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        <p className="text-xs font-semibold text-slate-400 uppercase mb-4">
          Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg
              text-slate-600 hover:bg-blue-50 hover:text-blue-600
              transition duration-200"
            >
              <Icon />
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          );
        })}

      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">

        <button className="flex items-center gap-3 px-4 py-3 w-full
          text-slate-600 hover:text-blue-600 rounded-lg">
          <FaCog />
          Settings
        </button>

        <button className="flex items-center gap-3 px-4 py-3 w-full
          text-red-500 hover:bg-red-50 rounded-lg">
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}