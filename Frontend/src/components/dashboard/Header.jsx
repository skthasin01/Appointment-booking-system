import { FaBell, FaSearch } from "react-icons/fa";

import TextInput from "../form/TextInput";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200
      flex items-center justify-between px-6">

      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Doctor Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Welcome back! Manage your appointments.
        </p>
      </div>

      <div className="flex items-center gap-5">

        <TextInput
          aria-label="Search"
          type="text"
          icon={FaSearch}
          placeholder="Search..."
          containerClassName="hidden md:block w-56"
        />

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
            <p className="text-sm font-semibold">Doctor</p>
            <p className="text-xs text-slate-500">Specialist</p>
          </div>
        </div>

      </div>

    </header>
  );
}