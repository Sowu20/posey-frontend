import axios from 'axios';

const token = localStorage.getItem('token');  // pas 'auth_token'

const api = axios.create({
  baseURL: 'https://8f917dd4af0a.ngrok-free.app/api/',
  headers: {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

export default api;
