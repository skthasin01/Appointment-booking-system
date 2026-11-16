import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import {
  FaBars,
  FaCalendarAlt,
  FaCalendarCheck,
  FaSignOutAlt,
  FaThLarge,
  FaTimes,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import useAuth from '../../hooks/useAuth';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Find Doctors', path: '/providers' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const linkClass = ({ isActive }) =>
  `block whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-base-content/70 hover:bg-base-200 hover:text-primary'
  }`;

const Navbar = () => {
  const { isAuthenticated, isProvider, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100 shadow-sm">
      <nav className="navbar mx-auto min-h-20 max-w-7xl flex-nowrap items-center justify-between gap-4 px-4 md:px-8">
        <div className="navbar-start w-auto flex-none">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
              <FaCalendarCheck className="text-xl" />
            </span>
            <span className="whitespace-nowrap text-xl font-bold">
              Appoint<span className="text-primary">Ease</span>
            </span>
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <ul className="flex flex-nowrap items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={linkClass}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end w-auto flex-none gap-2">
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {initials}
                </span>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-sm"
              >
                <li className="pointer-events-none">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-semibold text-base-content">
                      {user?.name}
                    </span>
                    <span className="text-xs text-base-content/50">
                      {user?.email}
                    </span>
                  </div>
                </li>
                <li>
                  <Link to="/my-appointments">
                    <FaCalendarAlt />
                    My Appointments
                  </Link>
                </li>
                {isProvider && (
                  <li>
                    <Link to="/provider/dashboard">
                      <FaThLarge />
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-error"
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle navigation"
            className="btn btn-ghost btn-square lg:hidden"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <ul className="menu w-full p-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={linkClass}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {isAuthenticated ? (
              <li className="mt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-error"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </li>
            ) : (
              <li className="mt-2 flex-row gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost btn-sm flex-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary btn-sm flex-1"
                >
                  Get Started
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
