import axios from 'axios'

const api = axios.create({
  baseURL: 'https://posey.loca.lt/api/',
  headers: {
    'Authorization': `Token ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
})

export default api