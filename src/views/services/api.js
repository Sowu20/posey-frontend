import axios from 'axios'

const api = axios.create({
  baseURL: 'https://10ee0e164b85.ngrok-free.app/api/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
})

export default api