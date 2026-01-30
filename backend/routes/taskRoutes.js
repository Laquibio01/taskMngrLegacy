const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation rules
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('status').optional().isIn(['Pendiente', 'En Progreso', 'Completada', 'Bloqueada', 'Cancelada']),
  body('priority').optional().isIn(['Baja', 'Media', 'Alta', 'Crítica']),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('actualHours').optional().isFloat({ min: 0 })
];

router.get('/', authenticate, taskController.getAllTasks);
router.get('/stats', authenticate, taskController.getTaskStats);
router.get('/search', authenticate, taskController.searchTasks);
router.get('/:id', authenticate, taskController.getTaskById);
router.post('/', authenticate, taskValidation, taskController.createTask);
router.put('/:id', authenticate, taskValidation, taskController.updateTask);
router.delete('/:id', authenticate, taskController.deleteTask);

module.exports = router;
