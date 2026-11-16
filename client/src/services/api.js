import axios from 'axios'

// URL del back. Se puede cambiar creando un archivo .env con VITE_API_URL=...
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const TOKEN_KEY = 'eventoxpress-token'
export const USER_KEY = 'eventoxpress-user'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Agrega el token a todas las peticiones si el usuario está logueado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el back responde 401 con una sesión guardada, el token venció: se cierra la sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY) && error.config?.headers?.Authorization) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      window.dispatchEvent(new Event('eventoxpress-logout'))
    }
    return Promise.reject(error)
  }
)

// Saca un mensaje legible de cualquier error de axios
export function getErrorMessage(error, fallback = 'Ocurrió un error, intentá de nuevo') {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor'
  return fallback
}

export default api
