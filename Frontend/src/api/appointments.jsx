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

// GET /appointments/stats — admins and doctors only
export const getAppointmentStats = async () => {
  const { data } = await client.get('/appointments/stats');
  return data;
};

// PATCH /appointments/{id}/status — patients may only set "cancelled"
export const updateAppointmentStatus = async (
  appointmentId,
  status,
  prescriptionNotes
) => {
  const { data } = await client.patch(`/appointments/${appointmentId}/status`, {
    status,
    ...(prescriptionNotes !== undefined
      ? { prescription_notes: prescriptionNotes }
      : {}),
  });
  return data;
};

export const cancelAppointment = (appointmentId) =>
  updateAppointmentStatus(appointmentId, 'cancelled');

// PATCH /appointments/{id}/reschedule — patient (own), admin, receptionist
// Only "confirmed" appointments can be moved.
// payload: { appointment_date, start_time, end_time }
export const rescheduleAppointment = async (appointmentId, payload) => {
  const { data } = await client.patch(
    `/appointments/${appointmentId}/reschedule`,
    payload
  );
  return data;
};
