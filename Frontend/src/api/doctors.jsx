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

export const getMyDoctorProfile = async (userId) => {
  const doctors = await getDoctors();
  return doctors.find((doctor) => doctor.user_id === userId) || null;
};

// PUT /doctors/{id} — admin or the owning doctor
export const updateDoctor = async (doctorId, payload) => {
  const { data } = await client.put(`/doctors/${doctorId}`, payload);
  return data;
};

// POST /doctors/{id}/image — admin or the owning doctor
export const uploadDoctorImage = async (doctorId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await client.post(`/doctors/${doctorId}/image`, formData);
  return data;
};

// POST /doctors — admin only. Creates the doctor's login account and profile.
export const createDoctor = async (payload) => {
  const { data } = await client.post('/doctors', payload);
  return data;
};

// DELETE /doctors/{id} — admin only. Also removes the doctor's account and appointments.
export const deleteDoctor = async (doctorId) => {
  const { data } = await client.delete(`/doctors/${doctorId}`);
  return data;
};
