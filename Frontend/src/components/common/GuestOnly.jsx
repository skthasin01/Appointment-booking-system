import { Navigate } from 'react-router';

import useAuth from '../../hooks/useAuth';
import { Frame, TextLines } from './Skeletons';

const GuestOnly = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestOnly;
