import { FaBars } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

export default function Header({ onMenuClick }) {
  const { user, isAdmin } = useAuth();

  const initials =
    user?.name
      ?.replace(/^Dr\.?\s+/i, "")
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="btn btn-ghost btn-square lg:hidden"
        >
          <FaBars />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-slate-800">
            {isAdmin ? "Admin Dashboard" : "Doctor Dashboard"}
          </h2>
          <p className="hidden truncate text-sm text-slate-500 sm:block">
            Welcome back! Manage your appointments.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
          {initials}
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}
