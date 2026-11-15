import { FaBell, FaSearch, FaBars } from "react-icons/fa";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200
      flex items-center justify-between px-6">

      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Provider Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Welcome back! Manage your appointments.
        </p>
      </div>

      <div className="flex items-center gap-5">

        <div className="hidden md:flex items-center bg-slate-100
          rounded-lg px-3 py-2">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-sm w-32"
          />
        </div>

        <button className="relative text-slate-500">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2
            bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100
            flex items-center justify-center text-blue-600 font-bold">
            P
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">Provider</p>
            <p className="text-xs text-slate-500">Service Provider</p>
          </div>
        </div>

      </div>

    </header>
  );
}