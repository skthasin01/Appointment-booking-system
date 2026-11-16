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
