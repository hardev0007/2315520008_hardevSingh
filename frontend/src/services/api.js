import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 10000 })

export const fetchNotifications = (params) => api.get('/notifications', { params }).then(r => r.data)
export const fetchUnread = (params) => api.get('/notifications/unread', { params }).then(r => r.data)
export const fetchPriority = (params) => api.get('/notifications/priority', { params }).then(r => r.data)

export default api
