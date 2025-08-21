import axios from 'axios'

const token = localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: 'https://b2035a69cd34.ngrok-free.app/api/',
  headers: {
    ...(token && { 'Authorization': `Token ${token}` }), // ou Bearer
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api