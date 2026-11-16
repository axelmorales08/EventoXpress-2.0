import { createContext } from 'react'

export const AuthContext = createContext(null)

export const ROLES = { ADMIN: 1, ORGANIZADOR: 2, CONSUMIDOR: 3 }

export const ROLE_NAMES = { 1: 'Administrador', 2: 'Organizador', 3: 'Consumidor' }

// A dónde se manda a cada rol después de iniciar sesión
export const HOME_BY_ROLE = {
  1: '/admin/usuarios',
  2: '/organizador',
  3: '/eventos',
}

// Datos fijos de la base (ver api/config/seeder.js)
export const CATEGORIES = [
  { id: 1, name: 'Música' },
  { id: 2, name: 'Deportes' },
  { id: 3, name: 'Teatro' },
  { id: 4, name: 'Exposiciones' },
  { id: 5, name: 'Festivales' },
  { id: 6, name: 'Fiestas y Celebraciones' },
  { id: 7, name: 'Gastronomía' },
  { id: 8, name: 'Conferencias y Charlas' },
]

export const VENUE_TYPES = [
  { id: 1, name: 'Presencial' },
  { id: 2, name: 'Virtual' },
]
