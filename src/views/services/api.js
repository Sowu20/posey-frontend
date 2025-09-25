import axios from 'axios'

const token = localStorage.getItem('auth_token');
// const user = user?.access || null;

const api = axios.create({
  baseURL: "https://lan-serve-comprehensive-majority.trycloudflare.com/api/",
  headers: {
    ...(token && { Authorization: `Token ${token}` }),
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default api
