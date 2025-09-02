import axios from 'axios'

const token = localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: "https://e6868a53a0e6.ngrok-free.app/api/",
  headers: {
    ...(token && { Authorization: `Token ${token}` }),
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api
