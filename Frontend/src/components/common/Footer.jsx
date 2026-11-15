
import { Link } from 'react-router';
import {
  FaCalendarCheck,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand Section */}
        <div>
          <Link to="/" className="mb-5 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <FaCalendarCheck className="text-xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Appoint<span className="text-primary">Ease</span>
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 text-slate-500">
            Making appointment booking simple, convenient and stress-free.
            Connect with trusted providers and book your appointments with ease.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex items-center gap-3">
            {[
              { icon: <FaFacebookF />, url: '#', label: 'Facebook' },
              { icon: <FaInstagram />, url: '#', label: 'Instagram' },
              { icon: <FaTwitter />, url: '#', label: 'Twitter' },
              { icon: <FaLinkedinIn />, url: '#', label: 'LinkedIn' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-primary hover:bg-primary hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-base font-bold text-slate-900">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm">
            {[
              { name: 'Home', path: '/' },
              { name: 'Find Providers', path: '/providers' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact Us', path: '/contact' },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="transition hover:pl-1 hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-5 text-base font-bold text-slate-900">
            Account
          </h3>

          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/login" className="transition hover:text-primary">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition hover:text-primary">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/provider/dashboard" className="transition hover:text-primary">
                Provider Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-base font-bold text-slate-900">
            Get In Touch
          </h3>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-primary" />
              <span>support@appointease.com</span>
            </li>

            <li className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 text-primary" />
              <span>+880 1XXXXXXXXX</span>
            </li>

            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-primary" />
              <span>Khulna, Bangladesh</span>
            </li>
          </ul>

          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
          >
            Contact Us <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-xs text-slate-500 sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} AppointEase. All rights reserved.
          </p>

          <p>
            Designed with care for a better booking experience.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
