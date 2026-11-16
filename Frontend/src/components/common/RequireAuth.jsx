import { Navigate, useLocation } from 'react-router';

import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isCustomer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  if (!isCustomer) {
    return <Navigate to="/provider/dashboard" replace />;
  }

  return children;
};

export default RequireAuth;
