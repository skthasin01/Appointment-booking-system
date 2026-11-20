import { Navigate, useLocation } from 'react-router';

import useAuth from '../../hooks/useAuth';
import { Frame, TextLines } from './Skeletons';

/**
 * Protects a route.
 * - Not signed in -> /login (and come back afterwards)
 * - `roles` given and the user's role is not in it -> `fallback`
 */
const RequireAuth = ({ children, roles, fallback = '/' }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Frame
        label="Checking your session"
        className="mx-auto max-w-md space-y-3 px-6 py-20"
      >
        <TextLines lines={2} />
      </Frame>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname + location.search,
          // e.g. the date/slot picked on Home, restored after login
          fromState: location.state ?? null,
        }}
        replace
      />
    );
  }

  if (roles?.length && !hasRole(...roles)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RequireAuth;
