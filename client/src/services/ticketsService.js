import api from './api'

export const ticketsService = {
  getByEvent: (venue_id) => api.get('/tickets_get', { params: { venue_id } }).then((r) => r.data),
  create: (data) => api.post('/tickets_post', data).then((r) => r.data),
  update: (ticket_id, name) => api.put('/tickets_modify', { ticket_id, name }).then((r) => r.data),
}
