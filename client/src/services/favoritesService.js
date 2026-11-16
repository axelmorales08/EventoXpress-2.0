import api from './api'

// El back toma el usuario del token
export const favoritesService = {
  getMine: () => api.get('/favorites').then((r) => r.data),
  add: (venue_id) => api.post('/favorite', { venue_id }).then((r) => r.data),
  remove: (venue_id) => api.delete('/desfavorite', { data: { venue_id } }).then((r) => r.data),
}
