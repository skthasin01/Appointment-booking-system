import client from './client';

// GET /doctors/{id}/schedule — weekly working hours
export const getDoctorSchedule = async (doctorId) => {
  const { data } = await client.get(`/doctors/${doctorId}/schedule`);
  return data;
};

// GET /doctors/{id}/slots?target_date=YYYY-MM-DD — free slots for one day
export const getAvailableSlots = async (doctorId, targetDate) => {
  const { data } = await client.get(`/doctors/${doctorId}/slots`, {
    params: { target_date: targetDate },
  });
  return data;
};
