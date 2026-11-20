import client from './client';

export const login = async (email, password) => {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
};

export const register = async (payload) => {
  const { data } = await client.post('/auth/register', payload);
  return data;
};

export const me = async () => {
  const { data } = await client.get('/auth/me');
  return data;
};

// POST /auth/change-password — any signed-in user
export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await client.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
};

// GET /auth/users — admin only
export const getUsers = async () => {
  const { data } = await client.get('/auth/users');
  return data;
};
