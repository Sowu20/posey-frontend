import axios from 'axios'

const api = axios.create({
  baseURL: 'https://cb46111a28ca.ngrok-free.app/api/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
})

export default api