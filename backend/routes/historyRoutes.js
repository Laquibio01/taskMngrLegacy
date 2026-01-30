const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/task/:taskId', authenticate, historyController.getHistoryByTask);
router.get('/', authenticate, historyController.getAllHistory);

module.exports = router;
