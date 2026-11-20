import { useCallback, useEffect, useMemo, useState } from 'react';

import { getMyAppointments, updateAppointmentStatus } from '../api/appointments';
import { getUsers } from '../api/auth';
import { getDoctors } from '../api/doctors';

const indexById = (items) => Object.fromEntries(items.map((item) => [item.id, item]));

const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lookupError, setLookupError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLookupError(null);
    try {
      const [appointmentData, lookupResults] = await Promise.all([
        getMyAppointments(),
        Promise.allSettled([getUsers(), getDoctors()]),
      ]);
      const [userResult, doctorResult] = lookupResults;
      setAppointments(appointmentData);
      setUsers(userResult.status === 'fulfilled' ? userResult.value : []);
      setDoctors(doctorResult.status === 'fulfilled' ? doctorResult.value : []);
      setLookupError(lookupResults.find((result) => result.status === 'rejected')?.reason || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateStatus = useCallback(async (appointmentId, status) => {
    const updated = await updateAppointmentStatus(appointmentId, status);
    setAppointments((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    return updated;
  }, []);

  const usersById = useMemo(() => indexById(users), [users]);
  const doctorsById = useMemo(() => indexById(doctors), [doctors]);

  return {
    appointments,
    doctors,
    usersById,
    doctorsById,
    loading,
    error,
    lookupError,
    reload,
    updateStatus,
  };
};

export default useAdminAppointments;
