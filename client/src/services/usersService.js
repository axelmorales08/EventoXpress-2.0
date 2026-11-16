import api from './api'

export const usersService = {
  // Perfil propio
  getProfile: () => api.get('/auth/info').then((r) => r.data),
  updateProfile: (changes) => api.patch('/auth/modify', changes).then((r) => r.data),

  // Administración (solo admin)
  getAll: () => api.get('/auth/users_get').then((r) => r.data),
  getById: (id) => api.get(`/auth/users_getById/${id}`).then((r) => r.data),
  update: (id, changes) => api.patch(`/auth/users_mody/${id}`, changes).then((r) => r.data),
  setStatus: (id, active) => api.patch(`/auth/users_status/${id}`, { active }).then((r) => r.data),
  setRole: (id, type_users_id) => api.patch(`/auth/users_role/${id}`, { type_users_id }).then((r) => r.data),
}
