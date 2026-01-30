const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation rules
const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 })
];

router.get('/', authenticate, projectController.getAllProjects);
router.get('/:id', authenticate, projectController.getProjectById);
router.post('/', authenticate, projectValidation, projectController.createProject);
router.put('/:id', authenticate, projectValidation, projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);

module.exports = router;
