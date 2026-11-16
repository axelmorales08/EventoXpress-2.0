import api from './api'

export const assistanceService = {
  register: (venue_id) => api.post('/assistance', { venue_id }).then((r) => r.data),
  cancel: (venue_id) => api.delete(`/assistance/${venue_id}`).then((r) => r.data),
  myEvents: (onlyUpcoming = false) =>
    api.get('/attendance_getByUser', { params: onlyUpcoming ? { proximos: true } : {} }).then((r) => r.data),
  byUser: (userId) => api.get(`/attendance_getByUser/${userId}`).then((r) => r.data),
  byEvent: (venueId) => api.get(`/attendance_getByEvent/${venueId}`).then((r) => r.data),
  all: () => api.get('/attendance_get').then((r) => r.data),
}
