import api from './api'

export const reportsService = {
  events: () => api.get('/reports/events').then((r) => r.data),
  attendance: (venue_id) => api.get('/reports/attendance', { params: venue_id ? { venue_id } : {} }).then((r) => r.data),
}
