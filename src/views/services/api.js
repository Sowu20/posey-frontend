import axios from 'axios'

const api = axios.create({
  baseURL: 'https://8f917dd4af0a.ngrok-free.app/api/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
})

export default api