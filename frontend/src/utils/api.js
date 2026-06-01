import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // FIX: only force-redirect on 401 for NON-auth endpoints
    // /auth/me 401 is handled by authSlice; don't double-trigger redirect
    const url = error.config?.url || ''
    const isAuthCheck = url.includes('/auth/me')
    if (error.response?.status === 401 && !isAuthCheck) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
