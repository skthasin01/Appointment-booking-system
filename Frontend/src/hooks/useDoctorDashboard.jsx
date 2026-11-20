import { useCallback, useEffect, useState } from 'react';

import {
  getAppointmentStats,
  getMyAppointments,
  updateAppointmentStatus,
} from '../api/appointments';

const fetchDashboard = () =>
  Promise.all([getAppointmentStats(), getMyAppointments()]);

const useDoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchDashboard()
      .then(([statsData, appointmentData]) => {
        if (active) {
          setStats(statsData);
          setAppointments(appointmentData);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, appointmentData] = await fetchDashboard();
      setStats(statsData);
      setAppointments(appointmentData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (appointmentId, status, notes) => {
    const updated = await updateAppointmentStatus(appointmentId, status, notes);
    setAppointments((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    getAppointmentStats()
      .then(setStats)
      .catch(() => {});
    return updated;
  }, []);

  return { stats, appointments, loading, error, reload, updateStatus };
};

export default useDoctorDashboard;
