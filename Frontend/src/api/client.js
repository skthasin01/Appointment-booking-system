import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://appointment-booking-system-l7r7.onrender.com/',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('appointease.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('appointease:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default client;
