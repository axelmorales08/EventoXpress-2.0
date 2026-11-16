import api from './api'

// Prefijo /auth (ver api/routes/userRoutes.js)
export const authService = {
  // { email, password } o { phone, password }
  login: (credentials) => api.post('/auth/login', credentials).then((r) => r.data),
  register: (data) => api.post('/auth/register', data).then((r) => r.data),

  // Admin en 2 pasos
  adminLogin: (user_name, password) => api.post('/auth/admin_login', { user_name, password }).then((r) => r.data),
  adminVerify: (pre_token, code) => api.post('/auth/admin_verify', { pre_token, code }).then((r) => r.data),

  // Organizador con código por mail
  organizerRequestCode: (email) => api.post('/auth/organizer/request_code', { email }).then((r) => r.data),
  organizerVerifyCode: (email, code) => api.post('/auth/organizer/verify_code', { email, code }).then((r) => r.data),

  // Recuperar contraseña: { email } o { phone }
  recoverPassword: (data) => api.post('/auth/recover_password', data).then((r) => r.data),
  resetPassword: (token, password) => api.post('/auth/reset_password', { token, password }).then((r) => r.data),

  verify: () => api.get('/auth/auth_verify').then((r) => r.data),
}
