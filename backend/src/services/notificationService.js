const axios = require('axios')
const { getAccessToken, clearToken } = require('./authService')

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

async function getNotifications(params = {}, retryCount = 0) {
  try {
    const token = await getAccessToken()
    const notifUrl = process.env.NOTIFICATIONS_API_URL || 'https://api.example.com/notifications'

    const query = {}
    if (params.limit) query.limit = params.limit
    if (params.page) query.page = params.page
    if (params.notification_type) query.notification_type = params.notification_type
    if (params.isRead !== undefined) query.isRead = params.isRead

    const response = await axios.get(notifUrl, {
      params: query,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    })

    return response.data
  } catch (err) {
    if (err.response && err.response.status === 401 && retryCount < 1) {
      console.log('Got 401, retrying...')
      clearToken()
      return getNotifications(params, retryCount + 1)
    }

    if ((err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
      console.log(`Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms`)
      await new Promise(r => setTimeout(r, delay))
      return getNotifications(params, retryCount + 1)
    }

    if (process.env.DEV_MOCK === 'true') {
      console.log(`Dev mode: returning mock data`)
      return [
        { id: 'mock-1', notification_type: 'Placement', content: 'Mock placement notification', isRead: false, createdAt: new Date().toISOString() },
        { id: 'mock-2', notification_type: 'Result', content: 'Mock result notification', isRead: false, createdAt: new Date(Date.now()-3600*1000).toISOString() },
        { id: 'mock-3', notification_type: 'Event', content: 'Mock event notification', isRead: true, createdAt: new Date(Date.now()-7200*1000).toISOString() }
      ]
    }

    throw err
  }
}

module.exports = { getNotifications }
