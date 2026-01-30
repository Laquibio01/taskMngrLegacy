const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, notificationController.getNotifications);
router.put('/mark-read', authenticate, notificationController.markAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
