import { Link, NavLink, useNavigate } from "react-router";
import {
  FaHome,
  FaCalendarCheck,
  FaCalendarAlt,
  FaBriefcase,
  FaUser,
  FaUserMd,
  FaUsers,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

const doctorMenu = [
  { name: "Dashboard", icon: FaHome, path: "/doctor", end: true },
  { name: "Appointments", icon: FaCalendarCheck, path: "/doctor/appointments" },
  { name: "My Schedule", icon: FaCalendarAlt, path: "/doctor/schedule" },
  { name: "My Services", icon: FaBriefcase, path: "/doctor/services" },
  { name: "My Profile", icon: FaUser, path: "/doctor/profile" },
];

const adminMenu = [
  { name: "Dashboard", icon: FaHome, path: "/admin", end: true },
  { name: "Appointments", icon: FaCalendarCheck, path: "/admin/appointments" },
  { name: "Doctors", icon: FaUserMd, path: "/admin/doctors" },
  { name: "Users", icon: FaUsers, path: "/admin/users" },
  { name: "My Profile", icon: FaUser, path: "/admin/profile" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-3 transition duration-200 ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
  }`;

export default function Sidebar({ onNavigate }) {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = isAdmin ? adminMenu : doctorMenu;

  const handleLogout = () => {
    onNavigate?.();
    logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <aside className="flex h-screen w-64 flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="text-xl font-bold text-blue-600"
        >
          Appoint<span className="text-slate-800">Ease</span>
        </Link>
        <p className="mt-1 text-xs text-slate-500">
          {isAdmin ? "Admin Dashboard" : "Doctor Dashboard"}
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        <p className="mb-4 text-xs font-semibold uppercase text-slate-400">
          Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={linkClass}
            >
              <Icon />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="flex-none space-y-2 border-t border-slate-100 p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:text-blue-600"
        >
          <FaGlobe />
          Back to website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-500 hover:bg-red-50"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}
