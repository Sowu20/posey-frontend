import axios from 'axios'

const token = localStorage.getItem('auth_token');

const api = axios.create({
  baseURL: "https://8c67a48dc6cb.ngrok-free.app/api/",
  headers: {
    ...(token && { Authorization: `Token ${token}` }),
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api
