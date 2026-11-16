import api from './api'

export const paymentsService = {
  // { types_payment_methods_id, user_id, responsible, number, expiration, CVV }
  create: (data) => api.post('/methodPayment_post', data).then((r) => r.data),
  getByUser: (user_id) => api.get('/methodPayment_get', { params: { user_id } }).then((r) => r.data),
}
