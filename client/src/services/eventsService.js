import api from './api'

export const eventsService = {
  getAll: (params) => api.get('/ev_info', { params }).then((r) => r.data),
  getById: (id) => api.get(`/events_getById/${id}`).then((r) => r.data),
  // filtros: { fecha, fecha_desde, fecha_hasta, precio_min, precio_max, provincia, localidad, ubicacion, categoria, tipo, state }
  filter: (filters) => api.get('/fil_ev', { params: filters }).then((r) => r.data),
  create: (data) => api.post('/ev_post', data).then((r) => r.data),
  update: (id, changes) => api.put(`/ev_mody/${id}`, changes).then((r) => r.data),
  remove: (id) => api.delete(`/ev_del/${id}`).then((r) => r.data),
}
