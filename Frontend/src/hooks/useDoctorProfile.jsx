import { useEffect, useState } from 'react';

import { getMyDoctorProfile } from '../api/doctors';
import useAuth from './useAuth';

const useDoctorProfile = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loadedFor, setLoadedFor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return undefined;

    let active = true;

    getMyDoctorProfile(user.id)
      .then((profile) => {
        if (active) {
          setDoctor(profile);
          setError(profile ? null : 'Doctor profile not found.');
          setLoadedFor(user.id);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
          setLoadedFor(user.id);
        }
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const loading = Boolean(user?.id) && loadedFor !== user.id;

  return { doctor, setDoctor, loading, error };
};

export default useDoctorProfile;
