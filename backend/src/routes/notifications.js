const express = require('express')
const router = express.Router()
const controller = require('../controllers/notificationsController')

router.get('/', controller.listNotifications)
router.get('/priority', controller.topPriority)
router.get('/unread', controller.unreadNotifications)

module.exports = router
