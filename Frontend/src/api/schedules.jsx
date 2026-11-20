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

export const replaceDoctorSchedule = async (doctorId, items) => {
  const { data } = await client.put(`/doctors/${doctorId}/schedule`, items);
  return data;
};

export const addDoctorSchedule = async (doctorId, item) => {
  const { data } = await client.post(`/doctors/${doctorId}/schedule`, item);
  return data;
};

export const updateDoctorSchedule = async (doctorId, scheduleId, payload) => {
  const { data } = await client.patch(
    `/doctors/${doctorId}/schedule/${scheduleId}`,
    payload
  );
  return data;
};

export const deleteDoctorSchedule = async (doctorId, scheduleId) => {
  const { data } = await client.delete(
    `/doctors/${doctorId}/schedule/${scheduleId}`
  );
  return data;
};
