const { getNotifications } = require('../services/notificationService')
const PriorityInbox = require('../algorithms/PriorityInbox')

exports.listNotifications = async (req, res) => {
  try {
    const { limit, page, notification_type } = req.query
    const data = await getNotifications({ limit, page, notification_type })
    const notifications = Array.isArray(data) ? data : (data.notifications || [])
    res.json(notifications)
  } catch (err) {
    console.error('Error:', err.message)
    const status = err.response?.status || 502
    res.status(status).json({ error: err.message || 'Failed to fetch notifications' })
  }
}

exports.unreadNotifications = async (req, res) => {
  try {
    const { limit, page } = req.query
    const data = await getNotifications({ isRead: false, limit, page })
    const notifications = Array.isArray(data) ? data : (data.notifications || [])
    res.json(notifications)
  } catch (err) {
    console.error('Error:', err.message)
    const status = err.response?.status || 502
    res.status(status).json({ error: err.message || 'Failed to fetch unread notifications' })
  }
}

exports.topPriority = async (req, res) => {
  try {
    const { limit, page } = req.query
    const data = await getNotifications({ isRead: false, limit, page })
    const notifications = Array.isArray(data) ? data : (data.notifications || [])

    const inbox = new PriorityInbox(10)
    notifications.forEach(n => inbox.pushNotification(n))
    const top = inbox.top()
    res.json({ top })
  } catch (err) {
    console.error('Error:', err.message)
    const status = err.response?.status || 502
    res.status(status).json({ error: err.message || 'Failed to compute priority inbox' })
  }
}
