import axios from 'axios'

const api = axios.create({
  baseURL: 'https://bfc66915958e.ngrok-free.app/api/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
})

export default api