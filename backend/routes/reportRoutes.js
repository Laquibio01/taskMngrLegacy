const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/tasks', authenticate, reportController.getTasksReport);
router.get('/projects', authenticate, reportController.getProjectsReport);
router.get('/users', authenticate, reportController.getUsersReport);
router.get('/export/csv', authenticate, reportController.exportTasksCSV);

module.exports = router;
