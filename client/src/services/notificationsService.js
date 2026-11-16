import api from './api'

export const notificationsService = {
  getMine: (onlyUnread = false) =>
    api.get('/notifications', { params: onlyUnread ? { unread: true } : {} }).then((r) => r.data),
  // { title, message } + venue_id | user_id | all: true
  send: (data) => api.post('/notifications', data).then((r) => r.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.patch('/notifications/read_all').then((r) => r.data),
}
