import axios from 'axios'

const token = localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: 'https://54b35c958e3d.ngrok-free.app/api/',
  headers: {
    ...(token && { 'Authorization': `Token ${token}` }), // ou Bearer
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api