import { Navigate, useLocation } from 'react-router';

import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

/**
 * Protects a route.
 * - Not signed in -> /login (and come back afterwards)
 * - `roles` given and the user's role is not in it -> `fallback`
 */
const RequireAuth = ({ children, roles, fallback = '/' }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
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
