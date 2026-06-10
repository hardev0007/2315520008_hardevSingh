const axios = require('axios')

const BASE = 'http://4.224.186.213/evaluation-service/notifications'

/**
 * Fetch notifications from external API.
 * If `authHeader` is provided it will be forwarded as `Authorization` header.
 * Otherwise, the environment variable EXTERNAL_API_KEY will be used if present.
 */
async function fetchNotifications(params = {}, authHeader = null) {
  const q = {}
  if (params.limit) q.limit = params.limit
  if (params.page) q.page = params.page
  if (params.notification_type) q.notification_type = params.notification_type
  if (params.isRead !== undefined) q.isRead = params.isRead

  const headers = {}
  if (authHeader) headers['Authorization'] = authHeader
  else if (process.env.EXTERNAL_API_KEY) headers['Authorization'] = `Bearer ${process.env.EXTERNAL_API_KEY}`

  try {
    const resp = await axios.get(BASE, { params: q, headers, timeout: 10000 })
    return resp.data
  } catch (err) {
    // If unauthorized and dev mock enabled, return sample notifications for local development
    const status = err.response && err.response.status
    if (status === 401 && process.env.DEV_MOCK === 'true') {
      return [
        { id: 'mock-1', notification_type: 'Placement', content: 'Mock placement notification', isRead: false, createdAt: new Date().toISOString() },
        { id: 'mock-2', notification_type: 'Result', content: 'Mock result notification', isRead: false, createdAt: new Date(Date.now()-3600*1000).toISOString() },
        { id: 'mock-3', notification_type: 'Event', content: 'Mock event notification', isRead: true, createdAt: new Date(Date.now()-7200*1000).toISOString() }
      ]
    }

    // Normalize error for callers
    if (err.response && err.response.data) {
      const msg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data)
      const st = err.response.status || 502
      const e = new Error(msg)
      e.status = st
      throw e
    }
    throw err
  }
}

module.exports = { fetchNotifications }
