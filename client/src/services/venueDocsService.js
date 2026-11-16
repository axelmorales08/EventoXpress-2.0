import api from './api'

// Medidas de seguridad y autorización del dueño del predio
export const securityService = {
  get: (venue_id) => api.get('/medidas-seguridad', { params: { venue_id } }).then((r) => r.data),
  create: (data) => api.post('/medidas-seguridad', data).then((r) => r.data),
  update: (data) => api.put('/medidas-seguridad', data).then((r) => r.data),
}

export const ownerAuthService = {
  get: (venue_id) => api.get('/autorizacion-dueno', { params: { venue_id } }).then((r) => r.data),
  create: (data) => api.post('/autorizacion-dueno', data).then((r) => r.data),
  update: (id, changes) => api.patch(`/autorizacion-dueno/${id}`, changes).then((r) => r.data),
}
