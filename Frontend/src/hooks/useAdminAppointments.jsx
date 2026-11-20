import { useCallback, useEffect, useMemo, useState } from 'react';

import { getMyAppointments, updateAppointmentStatus } from '../api/appointments';
import { getUsers } from '../api/auth';
import { getDoctors } from '../api/doctors';
import getErrorMessage from '../utils/getErrorMessage';

const indexById = (items) => Object.fromEntries(items.map((item) => [item.id, item]));


const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [appointmentData, userData, doctorData] = await Promise.all([
        getMyAppointments(),
        getUsers().catch(() => []), // names are optional — don't fail the page
        getDoctors().catch(() => []),
      ]);
      setAppointments(appointmentData);
      setUsers(userData);
      setDoctors(doctorData);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load appointments.'));
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
    reload,
    updateStatus,
  };
};

export default useAdminAppointments;
