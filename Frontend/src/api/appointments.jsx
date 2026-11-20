import client from './client';

// POST /appointments — patients only
// payload: { doctor_id, appointment_date, start_time, end_time, notes? }
export const bookAppointment = async (payload) => {
  const { data } = await client.post('/appointments', payload);
  return data;
};

// GET /appointments/my-appointments
// patient → own, doctor → assigned, admin → all
export const getMyAppointments = async () => {
  const { data } = await client.get('/appointments/my-appointments');
  return data;
};

// PATCH /appointments/{id}/status — patients may only set "cancelled"
export const updateAppointmentStatus = async (appointmentId, status) => {
  const { data } = await client.patch(`/appointments/${appointmentId}/status`, {
    status,
  });
  return data;
};

export const cancelAppointment = (appointmentId) =>
  updateAppointmentStatus(appointmentId, 'cancelled');
