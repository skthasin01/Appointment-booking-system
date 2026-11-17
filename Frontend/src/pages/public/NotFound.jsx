import { Link } from 'react-router';
import { FaHome, FaSearch } from 'react-icons/fa';

const destinations = [
  {
    title: 'Find doctors',
    text: 'Browse verified specialists and their open slots.',
    path: '/doctors',
  },
  {
    title: 'About us',
    text: 'Learn how AppointEase keeps booking simple.',
    path: '/about',
  },
  {
    title: 'Contact us',
    text: 'Questions? Send our team a message.',
    path: '/contact',
  },
];

const NotFound = () => (
  <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-6xl font-bold tracking-tight text-primary sm:text-7xl">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-base leading-7 text-base-content/60">
        The page you are looking for may have moved, or the link may be out of
        date. Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn btn-primary">
          <FaHome />
          Back to home
        </Link>
        <Link to="/doctors" className="btn btn-ghost">
          <FaSearch />
          Find doctors
        </Link>
      </div>
    </div>

    <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
      {destinations.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="card border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200"
        >
          <div className="card-body gap-2 p-5">
            <h2 className="font-semibold text-base-content">{item.title}</h2>
            <p className="text-sm leading-6 text-base-content/60">
              {item.text}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default NotFound;
