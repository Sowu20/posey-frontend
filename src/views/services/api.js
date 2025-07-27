import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
})

export default api