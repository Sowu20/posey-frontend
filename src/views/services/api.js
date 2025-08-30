import axios from 'axios'

const token = localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: ' https://bio-fair-complimentary-destinations.trycloudflare.com/api/',
  headers: {
    ...(token && { 'Authorization': `Token ${token}` }),
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api
