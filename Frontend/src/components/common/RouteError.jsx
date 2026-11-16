import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { FaArrowLeft, FaExclamationTriangle, FaHome } from 'react-icons/fa';

import Footer from './Footer';
import Navbar from './Navbar';

const RouteError = () => {
  const error = useRouteError();

  const isResponse = isRouteErrorResponse(error);
  const status = isResponse ? error.status : 500;
  const title =
    isResponse && status === 404 ? 'Page not found' : 'Something went wrong';
  const message = isResponse
    ? error.statusText || 'We could not load this page.'
    : error?.message || 'An unexpected error occurred.';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-20 lg:px-8">
        <div className="w-full max-w-lg text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-2xl text-error">
            <FaExclamationTriangle />
          </span>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-error">
            Error {status}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-base-content/60">
            {message}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn btn-primary">
              <FaHome />
              Back to home
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn btn-ghost"
            >
              <FaArrowLeft />
              Reload page
            </button>
          </div>

          {import.meta.env.DEV && (
            <details className="mt-10 text-left">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-base-content/50">
                Technical details
              </summary>
              <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-base-200 p-4 text-xs text-base-content/70">
                {error?.stack || String(error)}
              </pre>
            </details>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RouteError;
