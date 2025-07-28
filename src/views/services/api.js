import axios from 'axios'

const api = axios.create({
  baseURL: 'https://0cce3f2e8a5f.ngrok-free.app/api/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
})

export default api