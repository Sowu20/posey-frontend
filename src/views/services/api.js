import axios from 'axios'

const token = localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: 'https://2c71b2ac3538.ngrok-free.app/api/',
  headers: {
    ...(token && { 'Authorization': `Token ${token}` }), // ou Bearer
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api