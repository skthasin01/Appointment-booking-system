
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import {
    FaCalendarCheck,
    FaBars,
    FaTimes,
    FaArrowRight,
} from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Providers', path: '/providers' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const linkStyle = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
            ? 'text-primary'
            : 'text-base-content/70 hover:text-primary'
        }`;

    return (
        <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
            <nav className="navbar mx-auto flex min-h-20 max-w-7xl flex-nowrap items-center justify-between px-4 md:px-8">

                {/* তোমার existing Navbar content */}



                {/* Logo */}
                <div className="navbar-start flex-none">
                    <Link to="/" className="flex items-center gap-2">
                        <FaCalendarCheck className="text-2xl text-primary" />
                        <span className="whitespace-nowrap text-xl font-bold">
                            Appoint<span className="text-primary">Ease</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="hidden flex-1 items-center justify-center lg:flex">
                    <ul className="flex flex-row flex-nowrap items-center justify-center gap-3">
                        {navLinks.map((link) => (
                            <li key={link.path} className="flex-none">
                                <NavLink
                                    to={link.path}
                                    end={link.path === '/'}
                                    className={({ isActive }) =>
                                        `block whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-base-content/70 hover:bg-base-200 hover:text-primary'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Buttons */}
                <div className="navbar-end flex-none gap-2">
                    <div className="hidden items-center gap-2 sm:flex">
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm">
                            Get Started
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="btn btn-ghost btn-square lg:hidden"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
