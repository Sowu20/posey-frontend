import axios from 'axios';

const api = axios.create({
  baseURL: 'https://419020ecbcb9.ngrok-free.app/api/',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // toujours à jour
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;