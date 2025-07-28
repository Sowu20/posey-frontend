import axios from 'axios'

const token = localStorage.getItem('auth_token');
const api = axios.create({
  baseURL: 'https://cb46111a28ca.ngrok-free.app/api/',
  headers: token ? {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  }
})

export default api