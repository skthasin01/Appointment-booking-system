import client from './client';

// GET /doctors — supported filters: name, specialty, location, max_fee, is_available
export const getDoctors = async (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
  const { data } = await client.get('/doctors', { params });
  return data;
};

// GET /doctors/{id} — includes the doctor's weekly schedules
export const getDoctor = async (doctorId) => {
  const { data } = await client.get(`/doctors/${doctorId}`);
  return data;
};
