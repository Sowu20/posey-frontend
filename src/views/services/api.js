import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'https://e68a3a6c7086.ngrok-free.app/api/',
  headers: {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

export default api;